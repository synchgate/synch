import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CreditCard, FileText, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  EmptyState,
  LoadingBlock,
  PageHeader,
  StatCard,
} from "../../components/dashboard/ui";
import { STARTER_PLAN } from "../../config/pricing";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  creditRestriction,
  formatDate,
  formatNaira,
  formatNumber,
  titleCase,
  unwrap,
} from "../../lib/dashboard";

const STATUS_TONE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  active: "bg-emerald-100 text-emerald-700",
  success: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  invoiced: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  failed: "bg-red-100 text-red-700",
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

function Billing() {
  const { userEmail } = useAuth();

  const subscription = useQuery({
    queryKey: ["billing-subscription", userEmail],
    queryFn: async () => {
      try {
        return unwrap<any>(await api.get("/billing/subscriptions/current/"));
      } catch (error: any) {
        // a merchant on the free plan has no subscription record
        if (error?.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!userEmail,
    retry: false,
  });

  const usage = useQuery({
    queryKey: ["billing-usage", userEmail],
    queryFn: async () => unwrap<any>(await api.get("/billing/usage/")),
    enabled: !!userEmail,
    retry: false,
  });

  const history = useQuery({
    queryKey: ["billing-history", userEmail],
    queryFn: async () => unwrap<any>(await api.get("/billing/history/")),
    enabled: !!userEmail,
    retry: false,
  });

  const planHistory = useQuery({
    queryKey: ["billing-plan-history", userEmail],
    queryFn: async () =>
      unwrap<any[]>(await api.get("/billing/subscriptions/history/")),
    enabled: !!userEmail,
    retry: false,
  });

  // successful live transactions since the 1st of the month, which is what the plan limit counts.
  // Payouts count towards it as well as collections.
  const dayOfMonth = new Date().getDate();
  const monthUsage = useQuery({
    queryKey: ["billing-month-usage", userEmail, dayOfMonth],
    queryFn: async () => {
      const summary = unwrap<any>(
        await api.get("/analytics/summary/", {
          params: { environment: "live", days: dayOfMonth },
        }),
      );
      return ((summary?.collections?.successful_transactions ?? 0) +
        (summary?.payouts?.successful_transactions ?? 0)) as number;
    },
    enabled: !!userEmail,
    retry: false,
  });

  const forbidden = [subscription, usage, history].some(
    (query) => (query.error as any)?.response?.status === 403,
  );

  if (subscription.isLoading || usage.isLoading)
    return <LoadingBlock label="Loading billing…" />;

  if (forbidden) {
    return (
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Billing" />
        <Card className="mt-6" padded={false}>
          <EmptyState
            icon={<CreditCard className="w-6 h-6" />}
            title="You don't have access to billing"
          >
            Ask the owner of this business to give you billing access.
          </EmptyState>
        </Card>
      </div>
    );
  }

  const plan = subscription.data?.plan;
  const planName = plan?.name ?? usage.data?.plan ?? "Starter";
  const isFree = !plan || plan.tier === "free" || plan.tier === "starter";
  const limit =
    plan?.transaction_limit || (isFree ? STARTER_PLAN.transactions : 0);
  const used = monthUsage.data ?? 0;
  const percentUsed = limit
    ? Math.min(100, Math.round((used / limit) * 100))
    : 0;
  const nearLimit = limit > 0 && percentUsed >= 80;

  const invoices: any[] = history.data?.invoices ?? [];
  const fees: any[] = history.data?.fees ?? [];
  const planEntries: any[] = Array.isArray(planHistory.data)
    ? planHistory.data
    : [];
  const feePerTransaction = usage.data?.fee_per_transaction ?? 20;
  const restriction = creditRestriction(usage.data);
  const creditLimit = Number(usage.data?.credit_limit ?? 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Billing"
        description="Your plan, usage, platform fees and invoices."
      />

      {restriction && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">
              Live payments and payouts are paused
            </p>
            <p className="mt-1 text-red-800">
              {restriction === "locked"
                ? "Your account is restricted because invoices are overdue. "
                : "Your unpaid platform fees have reached your credit limit. "}
              Sandbox is unaffected. Once your payment is received it is applied
              to your invoices and live traffic resumes. To confirm a payment,
              email{" "}
              <a
                href="mailto:support@synchgate.com"
                className="font-semibold underline underline-offset-2"
              >
                support@synchgate.com
              </a>{" "}
              with your invoice reference.
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isFree
                  ? "bg-slate-100 text-slate-500"
                  : "bg-blue-600 text-white"
              }`}
            >
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {planName} plan
              </p>
              <p className="text-sm text-slate-500">
                {isFree
                  ? "Free. Upgrade for a higher monthly transaction limit."
                  : `${formatNaira(plan?.price)} a month`}
                {subscription.data?.end_date && !isFree
                  ? ` · renews ${formatDate(subscription.data.end_date)}`
                  : ""}
              </p>
            </div>
          </div>
          {isFree && (
            <Link
              to="/pricing"
              className="self-start sm:self-auto px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              Upgrade to Growth
            </Link>
          )}
        </div>

        {limit > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">
                Successful live transactions this month
              </span>
              <span className="font-semibold text-slate-900">
                {formatNumber(used)} of {formatNumber(limit)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${nearLimit ? "bg-amber-500" : "bg-blue-600"}`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            {nearLimit && (
              <p className="text-xs text-amber-700 mt-2">
                {percentUsed >= 100
                  ? "You've reached your limit, so new live payments and payouts are paused until next month or an upgrade."
                  : "You're close to your monthly limit."}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Platform fee per transaction"
          value={formatNaira(feePerTransaction)}
          hint="On each successful live payment. Payouts and sandbox are free."
        />
        <StatCard
          label="Unpaid fees"
          value={formatNaira(usage.data?.current_balance ?? 0)}
          hint={`${formatNumber(usage.data?.pending_fee_count ?? 0)} pending, ${formatNumber(usage.data?.invoiced_fee_count ?? 0)} invoiced`}
        />
        <StatCard
          label="Credit limit"
          value={formatNaira(creditLimit)}
          hint={`${formatNaira(usage.data?.available_credit ?? 0)} available before live traffic pauses`}
        />
        <StatCard
          label="Account status"
          value={titleCase(usage.data?.account_status ?? "active")}
          hint="Your billing standing"
        />
      </div>

      <Card
        padded={false}
        title="Invoices"
        description="Platform fees are billed on invoices."
      >
        {history.isLoading ? (
          <LoadingBlock />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No invoices yet"
          >
            When your platform fees are invoiced, they appear here.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Period</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">
                    Remaining
                  </th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {invoice.reference}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(invoice.period_start)} –{" "}
                      {formatDate(invoice.period_end)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                      {formatNaira(invoice.amount_due)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-600">
                      {formatNaira(invoice.amount_remaining)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill value={invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card padded={false} title="Recent platform fees">
        {fees.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-6 h-6" />}
            title="No fees yet"
          >
            A fee is recorded for each successful live transaction.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Transaction</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Fee</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.slice(0, 10).map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">
                      {fee.transaction_id}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(fee.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                      {formatNaira(fee.fee_amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill value={fee.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card padded={false} title="Plan history">
        {planEntries.length === 0 ? (
          <EmptyState title="No plan changes yet">
            Upgrades and cancellations appear here.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium text-right">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(entry.recorded_at)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {entry.plan?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-700">
                      {entry.plan?.price != null
                        ? formatNaira(entry.plan.price)
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill value={entry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Billing;
