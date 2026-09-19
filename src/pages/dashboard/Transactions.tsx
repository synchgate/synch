import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  Receipt,
  Search,
  Server,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  EmptyState,
  EnvironmentBadge,
  PageHeader,
  Pagination,
  SegmentedControl,
  StatusBadge,
  TypeBadge,
} from "../../components/dashboard/ui";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  formatAmount,
  formatDateTime,
  PROVIDER_NAMES,
  titleCase,
  useEnvironment,
} from "../../lib/dashboard";

const PAGE_SIZE = 25;

type StatusTab = "all" | "success" | "failed" | "in_progress";

const STATUS_QUERY: Record<StatusTab, string | undefined> = {
  all: undefined,
  success: "success",
  failed: "failed,abandoned",
  in_progress: "pending,processing,retrying",
};

// a payout in one of these has not reached a final answer yet
const OPEN_STATUSES = ["pending", "processing", "retrying"];

const ROUTE_LABELS: Record<string, string> = {
  basic: "Chosen by you",
  smart_policy: "Smart Route rule",
  smart_score: "Smart Route score",
};

/** Waits for typing to pause before it triggers a request. */
function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-600 cursor-pointer"
      aria-label="Copy"
    >
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <div className="font-medium text-slate-900 text-sm break-words">
        {children || "—"}
      </div>
    </div>
  );
}

function Transactions() {
  const { userEmail } = useAuth();
  const environment = useEnvironment();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [checkNote, setCheckNote] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounced(search);

  // asks the provider where an open payout stands and records the answer
  const checkStatus = useMutation({
    mutationFn: async (id: string) =>
      (
        await api.post(`/transactions/${id}/refresh/`, null, {
          params: { environment },
        })
      ).data,
    onSuccess: (body) => {
      if (body?.data) setSelected(body.data);
      setCheckNote(
        body?.refresh?.checked
          ? (body.message ?? null)
          : "Couldn't get an answer from the provider just now. Try again in a moment.",
      );
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () =>
      setCheckNote("Couldn't check the status. Try again in a moment."),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: a different transaction starts with no note
  useEffect(() => {
    setCheckNote(null);
  }, [selected?.id]);

  // any change to the filters or the Test/Live switch starts again from page 1
  // biome-ignore lint/correctness/useExhaustiveDependencies: these are exactly the values that should reset the page
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    statusTab,
    provider,
    type,
    dateFrom,
    dateTo,
    environment,
  ]);

  const filtersActive = Boolean(
    debouncedSearch ||
      statusTab !== "all" ||
      provider ||
      type ||
      dateFrom ||
      dateTo,
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      "transactions",
      userEmail,
      environment,
      page,
      debouncedSearch,
      statusTab,
      provider,
      type,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const response = await api.get("/transactions/", {
        params: {
          environment,
          page,
          page_size: PAGE_SIZE,
          status: STATUS_QUERY[statusTab],
          provider: provider || undefined,
          type: type || undefined,
          search: debouncedSearch || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        },
      });
      return response.data;
    },
    enabled: !!userEmail,
    placeholderData: keepPreviousData,
  });

  const transactions: any[] = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    page_size: PAGE_SIZE,
    total: 0,
    total_pages: 1,
  };

  const clearFilters = () => {
    setSearch("");
    setStatusTab("all");
    setProvider("");
    setType("");
    setDateFrom("");
    setDateTo("");
  };

  const selectClass =
    "px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Transactions"
        description="Every payment you collect and every payout you send, across all providers."
        actions={<EnvironmentBadge environment={environment} />}
      />

      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <SegmentedControl<StatusTab>
            label="Filter by status"
            value={statusTab}
            onChange={setStatusTab}
            options={[
              { value: "all", label: "All" },
              { value: "success", label: "Successful" },
              { value: "failed", label: "Failed" },
              { value: "in_progress", label: "In progress" },
            ]}
          />
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search transactions"
              placeholder="Search reference, email, account…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            <option value="">Payments and payouts</option>
            <option value="collection">Payments only</option>
            <option value="payout">Payouts only</option>
          </select>
          <select
            aria-label="Provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={selectClass}
          >
            <option value="">All providers</option>
            {PROVIDER_NAMES.map((name) => (
              <option key={name} value={name}>
                {titleCase(name)}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="From date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className={selectClass}
            />
            <span className="text-slate-400 text-sm">to</span>
            <input
              type="date"
              aria-label="To date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className={selectClass}
            />
          </div>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Clear filters
            </button>
          )}
          {isFetching && !isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
                key={i}
                className="h-12 rounded bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<XCircle className="w-6 h-6" />}
            title="We couldn't load your transactions"
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Try again
              </button>
            }
          >
            Check your connection and try again.
          </EmptyState>
        ) : transactions.length === 0 ? (
          filtersActive ? (
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title="No transactions match these filters"
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<Receipt className="w-6 h-6" />}
              title={
                environment === "live"
                  ? "No live transactions yet"
                  : "No test transactions yet"
              }
              action={
                <Link
                  to="/docs/installation"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Make your first request
                </Link>
              }
            >
              {environment === "live"
                ? "Payments and payouts you make with your live key will show up here."
                : "Send a request with your sandbox key and it will appear here. Nothing in test mode moves real money."}
            </EmptyState>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">
                    Customer / recipient
                  </th>
                  <th className="px-5 py-3 font-medium">Provider</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelected(tx)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(tx);
                        }}
                        className="text-left cursor-pointer"
                      >
                        <span className="block font-medium text-slate-900 max-w-[220px] truncate">
                          {tx.reference || tx.transaction_id}
                        </span>
                        <span className="block font-mono text-[11px] text-slate-400">
                          {tx.transaction_id}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <TypeBadge type={tx.transaction_type} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[200px]">
                      <span className="block truncate">
                        {tx.transaction_type === "payout"
                          ? tx.beneficiary?.name || "—"
                          : tx.customer_email || "—"}
                      </span>
                      {tx.transaction_type === "payout" &&
                        tx.beneficiary?.bank_name && (
                          <span className="block text-[11px] text-slate-400 truncate">
                            {tx.beneficiary.bank_name}
                          </span>
                        )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 capitalize">
                      {tx.provider || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {tx.transaction_type === "payout" ? "−" : ""}
                      {formatAmount(tx.amount, tx.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {formatDateTime(tx.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && !isError && transactions.length > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.total_pages}
            total={pagination.total}
            pageSize={pagination.page_size}
            onChange={setPage}
          />
        )}
      </div>

      {/* Details panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-default"
            onClick={() => setSelected(null)}
          />
          <aside className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900">
                  {selected.transaction_type === "payout"
                    ? "Payout details"
                    : "Payment details"}
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                  {selected.transaction_id}{" "}
                  <CopyValue value={selected.transaction_id} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-between border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                    {selected.transaction_type === "payout"
                      ? "Amount sent"
                      : "Amount"}
                  </p>
                  <p className="font-['Outfit'] text-3xl font-bold text-slate-900">
                    {formatAmount(selected.amount, selected.currency)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <StatusBadge status={selected.status} />
                  <EnvironmentBadge environment={environment} />
                </div>
              </div>

              {selected.transaction_type === "payout" &&
                OPEN_STATUSES.includes(selected.status) && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900">
                        This payout hasn't finished
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        {checkNote ??
                          "We check with the provider every couple of minutes and update this page. Don't send it again unless it shows Failed, or the money may go out twice."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => checkStatus.mutate(selected.id)}
                      disabled={checkStatus.isPending}
                      className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100 disabled:opacity-60 cursor-pointer"
                    >
                      {checkStatus.isPending && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Check status
                    </button>
                  </div>
                )}

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Overview
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="Your reference">
                    <span className="inline-flex items-center gap-2">
                      {selected.reference}
                      {selected.reference && (
                        <CopyValue value={selected.reference} />
                      )}
                    </span>
                  </Field>
                  <Field label="Provider">
                    <span className="capitalize">{selected.provider}</span>
                  </Field>
                  <Field label="Type">
                    <TypeBadge type={selected.transaction_type} />
                  </Field>
                  <Field label="Channel">{titleCase(selected.channel)}</Field>
                  {selected.transaction_type !== "payout" && (
                    <>
                      <Field label="Customer">{selected.customer_email}</Field>
                      <Field label="Routing">
                        {ROUTE_LABELS[selected.route] ??
                          titleCase(selected.route)}
                      </Field>
                    </>
                  )}
                  <Field label="Created">
                    {formatDateTime(selected.created_at)}
                  </Field>
                  <Field label="Completed">
                    {formatDateTime(selected.completed_at)}
                  </Field>
                </div>
                {selected.message && (
                  <Field label="Message">{selected.message}</Field>
                )}
              </div>

              {selected.beneficiary && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                    Recipient
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="Account name">
                      {selected.beneficiary.name}
                    </Field>
                    <Field label="Account number">
                      <span className="font-mono">
                        {selected.beneficiary.account_number}
                      </span>
                    </Field>
                    <Field label="Bank">
                      {selected.beneficiary.bank_name ||
                        selected.beneficiary.bank_code}
                    </Field>
                    <Field label="Narration">
                      {selected.beneficiary.narration}
                    </Field>
                    <Field label="Provider reference">
                      <span className="font-mono text-xs">
                        {selected.beneficiary.provider_reference}
                      </span>
                    </Field>
                    <Field label="Provider fee">
                      {selected.beneficiary.fee != null
                        ? formatAmount(
                            selected.beneficiary.fee,
                            selected.currency,
                          )
                        : null}
                    </Field>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  What happened
                </h3>
                <ol className="space-y-3">
                  {[
                    {
                      icon: <ArrowRight className="w-3 h-3" />,
                      tone: "bg-blue-100 text-blue-600",
                      title: "Request received",
                      text: `Your request reached SynchGate on ${formatDateTime(selected.created_at)}.`,
                    },
                    {
                      icon: <Server className="w-3 h-3" />,
                      tone: "bg-indigo-100 text-indigo-600",
                      title: `Sent to ${titleCase(selected.provider)}`,
                      text:
                        selected.transaction_type === "payout"
                          ? "Paid out through the provider you named."
                          : (ROUTE_LABELS[selected.route] ??
                              "Routed to the provider.") + ".",
                    },
                    {
                      icon:
                        selected.status === "success" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        ),
                      tone:
                        selected.status === "success"
                          ? "bg-emerald-100 text-emerald-600"
                          : selected.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600",
                      title: `Status: ${titleCase(selected.status)}`,
                      text:
                        selected.message ||
                        (selected.completed_at
                          ? `Finished on ${formatDateTime(selected.completed_at)}.`
                          : "Not finished yet."),
                    },
                  ].map((step) => (
                    <li
                      key={step.title}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.tone}`}
                      >
                        {step.icon}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {step.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Provider response
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(selected.metadata ?? selected, null, 2),
                      )
                    }
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy JSON
                  </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto max-h-80 overflow-y-auto">
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selected.metadata ?? selected, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Transactions;
