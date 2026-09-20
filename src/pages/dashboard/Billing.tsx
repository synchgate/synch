import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Receipt,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pagination,
} from "../../components/dashboard/ui";
import { MIN_TOPUP_NGN, topUpBreakdown } from "../../config/pricing";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  formatDateTime,
  formatNaira,
  formatNumber,
  titleCase,
  unwrap,
  type WalletSummary,
  walletState,
} from "../../lib/dashboard";

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000];
const LEDGER_PAGE_SIZE = 15;

const ENTRY_LABELS: Record<string, string> = {
  topup: "Top-up",
  bonus: "Top-up bonus",
  hold: "Fee set aside",
  release: "Fee released",
  charge: "Platform fee",
  fee_refund: "Fee refunded",
  withdrawal: "Refund to you",
  adjustment: "Adjustment",
};

const STATUS_TONE: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-slate-100 text-slate-600",
};

function Pill({ value }: { value?: string }) {
  const key = (value ?? "").toLowerCase();
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_TONE[key] ?? "bg-slate-100 text-slate-600"}`}
    >
      {titleCase(value)}
    </span>
  );
}

/** A signed naira amount for the statement: +₦500, −₦20, or a dash when it did not move. */
function signed(value: string | number) {
  const n = Number(value);
  if (!n) return <span className="text-slate-300">—</span>;
  return (
    <span className={n > 0 ? "text-emerald-600" : "text-slate-700"}>
      {n > 0 ? "+" : "−"}
      {formatNaira(Math.abs(n))}
    </span>
  );
}

const errorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ?? fallback;

function Billing() {
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();

  const [amountInput, setAmountInput] = useState(String(MIN_TOPUP_NGN));
  const [ledgerPage, setLedgerPage] = useState(1);
  const [notice, setNotice] = useState<{
    tone: "ok" | "warn" | "error";
    text: string;
  } | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");

  const wallet = useQuery({
    queryKey: ["wallet", userEmail],
    queryFn: async () => unwrap<WalletSummary>(await api.get("/wallet/")),
    enabled: !!userEmail,
    retry: false,
  });

  const ledger = useQuery({
    queryKey: ["wallet-ledger", userEmail, ledgerPage],
    queryFn: async () =>
      (
        await api.get("/wallet/ledger/", {
          params: { page: ledgerPage, page_size: LEDGER_PAGE_SIZE },
        })
      ).data,
    enabled: !!userEmail,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const topups = useQuery({
    queryKey: ["wallet-topups", userEmail],
    queryFn: async () => unwrap<any[]>(await api.get("/wallet/topups/")),
    enabled: !!userEmail,
    retry: false,
  });

  const refunds = useQuery({
    queryKey: ["wallet-refunds", userEmail],
    queryFn: async () =>
      unwrap<any[]>(await api.get("/wallet/refund-requests/")),
    enabled: !!userEmail,
    retry: false,
  });

  const refreshWallet = () => {
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-ledger"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-topups"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-refunds"] });
  };

  const summary = wallet.data;
  const fee = Number(summary?.fee_per_transaction ?? 20);
  const minTopUp = Number(summary?.min_topup ?? MIN_TOPUP_NGN);
  const bonusPercent = Number(summary?.topup_bonus_percent ?? 10);

  const amount = Number(amountInput.replace(/,/g, ""));
  const validAmount = Number.isFinite(amount) && amount >= minTopUp;
  const preview = topUpBreakdown(validAmount ? amount : 0, fee, bonusPercent);

  const startTopUp = useMutation({
    mutationFn: async () =>
      unwrap<any>(
        await api.post("/wallet/topups/", {
          amount,
          callback_url: `${window.location.origin}/dashboard/billing`,
        }),
      ),
    onSuccess: (topup) => {
      if (topup?.payment_url) {
        window.location.href = topup.payment_url;
      } else {
        setNotice({
          tone: "error",
          text: "We couldn't open the payment page. Please try again.",
        });
      }
    },
    onError: (error) =>
      setNotice({
        tone: "error",
        text: errorMessage(error, "Couldn't start the top-up. Try again."),
      }),
  });

  // Checks one top-up with the provider and credits it if it was paid.
  const checkTopUp = useMutation({
    mutationFn: async (reference: string) =>
      unwrap<any>(await api.post(`/wallet/topups/${reference}/verify/`)),
    onSuccess: (topup) => {
      refreshWallet();
      if (topup?.status === "success") {
        setNotice({
          tone: "ok",
          text: `Your wallet has been topped up with ${formatNaira(Number(topup.amount))} and ${formatNaira(Number(topup.bonus_amount))} bonus.`,
        });
      } else if (topup?.status === "pending") {
        setNotice({
          tone: "warn",
          text: "We haven't received confirmation of that payment yet. It will be credited as soon as it clears.",
        });
      } else {
        setNotice({
          tone: "error",
          text: "That payment didn't go through, so nothing was added.",
        });
      }
    },
    onError: (error) =>
      setNotice({
        tone: "error",
        text: errorMessage(error, "Couldn't check that payment. Try again."),
      }),
  });

  // Coming back from the payment page: confirm the top-up straight away, then tidy the address bar.
  const handledReturn = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: this must run once, on arrival
  useEffect(() => {
    if (handledReturn.current) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") ?? params.get("trxref");
    if (!reference?.startsWith("topup-")) return;
    handledReturn.current = true;
    window.history.replaceState({}, "", window.location.pathname);
    checkTopUp.mutate(reference);
  }, []);

  const requestRefund = useMutation({
    mutationFn: async () =>
      unwrap<any>(
        await api.post("/wallet/refund-requests/", {
          amount: Number(refundAmount),
          note: refundNote || undefined,
        }),
      ),
    onSuccess: () => {
      setRefundAmount("");
      setRefundNote("");
      refreshWallet();
      setNotice({
        tone: "ok",
        text: "Refund requested. We'll pay it to your bank account. The status shows here.",
      });
    },
    onError: (error) =>
      setNotice({
        tone: "error",
        text: errorMessage(error, "Couldn't request that refund."),
      }),
  });

  if (wallet.isLoading) return <LoadingBlock label="Loading your wallet…" />;

  if ((wallet.error as any)?.response?.status === 403) {
    return (
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Wallet" />
        <Card className="mt-6" padded={false}>
          <EmptyState
            icon={<Wallet className="w-6 h-6" />}
            title="You don't have access to the wallet"
          >
            Ask the owner of this business to give you billing access.
          </EmptyState>
        </Card>
      </div>
    );
  }

  const state = walletState(summary);
  const entries: any[] = ledger.data?.data ?? [];
  const pagination = ledger.data?.pagination ?? {
    page: 1,
    page_size: LEDGER_PAGE_SIZE,
    total: 0,
    total_pages: 1,
  };
  const pendingTopUps = (topups.data ?? []).filter(
    (topup) => topup.status === "pending",
  );
  const openRefund = (refunds.data ?? []).find(
    (refund) => refund.status === "pending",
  );
  const refundable = Number(summary?.refundable ?? 0);
  const refundValue = Number(refundAmount);
  const validRefund =
    Number.isFinite(refundValue) &&
    refundValue > 0 &&
    refundValue <= refundable;

  const noticeTone = {
    ok: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Wallet"
        description={`Prepay for platform fees. ${formatNaira(fee)} is taken for each successful live payment or payout. Failed transactions and the sandbox are free.`}
      />

      {notice && (
        <output
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${noticeTone[notice.tone]}`}
        >
          {notice.tone === "ok" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <p className="flex-1">{notice.text}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </output>
      )}

      {state && (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            state === "empty"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">
              {state === "empty"
                ? "Live payments and payouts are paused"
                : "Your wallet is running low"}
            </p>
            <p className="mt-1">
              {state === "empty"
                ? "There isn't enough in your wallet to cover the fee for a new transaction. Add funds to resume. Sandbox is unaffected."
                : `You have enough for about ${formatNumber(summary?.transactions_remaining)} more transactions. Add funds so live traffic doesn't stop.`}
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <p className="text-sm font-medium text-slate-500">
            Available balance
          </p>
          <p className="mt-1 font-['Outfit'] text-5xl font-bold text-slate-900">
            {formatNaira(Number(summary?.available ?? 0))}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Enough for about{" "}
            <strong className="text-slate-800">
              {formatNumber(summary?.transactions_remaining)}
            </strong>{" "}
            more live transactions.
          </p>

          <dl className="mt-6 grid sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-sm">
            <div>
              <dt className="text-slate-500">Cash</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatNaira(Number(summary?.cash_balance ?? 0))}
              </dd>
              <dd className="text-xs text-slate-400">What you paid in</dd>
            </div>
            <div>
              <dt className="text-slate-500">Bonus</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatNaira(Number(summary?.bonus_balance ?? 0))}
              </dd>
              <dd className="text-xs text-slate-400">
                Spent after your cash. Not refundable
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Set aside</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatNaira(Number(summary?.held_amount ?? 0))}
              </dd>
              <dd className="text-xs text-slate-400">
                For transactions in progress
              </dd>
            </div>
          </dl>
        </Card>

        <Card
          className="lg:col-span-2"
          title="Add funds"
          description={`Minimum ${formatNaira(minTopUp)}. You get ${bonusPercent}% extra on every top-up.`}
        >
          <label
            htmlFor="topup-amount"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            Amount (₦)
          </label>
          <input
            id="topup-amount"
            inputMode="numeric"
            value={amountInput}
            onChange={(event) =>
              setAmountInput(event.target.value.replace(/[^\d,]/g, ""))
            }
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setAmountInput(String(quick))}
                className={`px-3 py-1 rounded-full border text-xs font-semibold cursor-pointer ${
                  amount === quick
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {formatNaira(quick)}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm space-y-1.5">
            {validAmount ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">You pay</span>
                  <span className="font-medium">{formatNaira(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Bonus ({bonusPercent}%)
                  </span>
                  <span className="font-medium text-emerald-600">
                    +{formatNaira(preview.bonus)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Added to your wallet</span>
                  <span className="font-semibold">
                    {formatNaira(preview.credit)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  About {formatNumber(preview.transactions)} transactions at{" "}
                  {formatNaira(fee)} each.
                </p>
              </>
            ) : (
              <p className="text-slate-500">
                Enter at least {formatNaira(minTopUp)}.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!validAmount || startTopUp.isPending}
            onClick={() => {
              setNotice(null);
              startTopUp.mutate();
            }}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {startTopUp.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {validAmount ? `Pay ${formatNaira(amount)}` : "Add funds"}
          </button>

          {pendingTopUps.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Waiting for payment
              </p>
              <ul className="space-y-2">
                {pendingTopUps.map((topup) => (
                  <li
                    key={topup.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-slate-600">
                      {formatNaira(Number(topup.amount))} ·{" "}
                      {formatDateTime(topup.created_at)}
                    </span>
                    <button
                      type="button"
                      disabled={checkTopUp.isPending}
                      onClick={() => checkTopUp.mutate(topup.reference)}
                      className="font-semibold text-blue-600 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      Check payment
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <Card
        padded={false}
        title="Statement"
        description="Every movement in your wallet, newest first."
      >
        {ledger.isLoading ? (
          <LoadingBlock />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-6 h-6" />}
            title="Nothing yet"
          >
            Top-ups and platform fees show up here.
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Activity</th>
                    <th className="px-5 py-3 font-medium">Reference</th>
                    <th className="px-5 py-3 font-medium text-right">Cash</th>
                    <th className="px-5 py-3 font-medium text-right">Bonus</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Set aside
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {formatDateTime(entry.created_at)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {ENTRY_LABELS[entry.entry_type] ?? entry.description}
                        {entry.entry_type === "adjustment" &&
                          entry.description && (
                            <span className="block text-xs font-normal text-slate-500">
                              {entry.description}
                            </span>
                          )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                        {entry.reference || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {signed(entry.cash_delta)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {signed(entry.bonus_delta)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500">
                        {signed(entry.held_delta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              total={pagination.total}
              pageSize={pagination.page_size}
              onChange={setLedgerPage}
              noun="entries"
            />
          </>
        )}
      </Card>

      <Card
        title="Refund unused balance"
        description="Cash you haven't used can be paid back to your bank account. Bonus credit can't be refunded."
      >
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <p className="text-xs text-slate-500">Refundable now</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatNaira(refundable)}
            </p>
          </div>
          {openRefund ? (
            <p className="sm:col-span-2 text-sm text-slate-600">
              Your request for{" "}
              <strong>{formatNaira(Number(openRefund.amount))}</strong> is being
              processed. The status here updates once it's paid.
            </p>
          ) : (
            <>
              <div>
                <label
                  htmlFor="refund-amount"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  Amount (₦)
                </label>
                <input
                  id="refund-amount"
                  inputMode="decimal"
                  value={refundAmount}
                  onChange={(event) =>
                    setRefundAmount(event.target.value.replace(/[^\d.]/g, ""))
                  }
                  disabled={refundable <= 0}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
              <button
                type="button"
                disabled={!validRefund || requestRefund.isPending}
                onClick={() => requestRefund.mutate()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {requestRefund.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Request refund
              </button>
            </>
          )}
        </div>
        {!openRefund && (
          <input
            aria-label="Note for the refund (optional)"
            placeholder="Note (optional)"
            value={refundNote}
            onChange={(event) => setRefundNote(event.target.value)}
            maxLength={255}
            className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {(refunds.data ?? []).length > 0 && (
          <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
            {(refunds.data ?? []).map((refund) => (
              <li
                key={refund.id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-slate-600">
                  {formatNaira(Number(refund.amount))} ·{" "}
                  {formatDateTime(refund.created_at)}
                  {refund.staff_note && (
                    <span className="block text-xs text-slate-500">
                      {refund.staff_note}
                    </span>
                  )}
                </span>
                <Pill value={refund.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default Billing;
