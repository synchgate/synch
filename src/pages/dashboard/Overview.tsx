import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  LineChart as LineChartIcon,
  Server,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  EmptyState,
  EnvironmentBadge,
  LoadingBlock,
  PageHeader,
  StatCard,
  StatusBadge,
  TypeBadge,
} from "../../components/dashboard/ui";
import { CodeTabs } from "../../components/docs/CodeBlock";
import { requestSnippets } from "../../components/docs/snippets";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  formatAmount,
  formatNaira,
  formatNumber,
  timeAgo,
  unwrap,
  useEnvironment,
} from "../../lib/dashboard";

const DISMISS_KEY = "synchgate:onboarding-dismissed";

const testRequest = requestSnippets({
  method: "POST",
  path: "/initiate-payment/",
  body: {
    provider: "paystack",
    email: "customer@example.com",
    amount: 5000,
    reference: "my-first-test-001",
    callback_url: "https://yourdomain.com/payments/callback",
  },
});

function useTransactionTotal(environment: "live" | "sandbox") {
  const { userEmail } = useAuth();
  return useQuery({
    queryKey: ["transaction-total", userEmail, environment],
    queryFn: async () => {
      const response = await api.get("/transactions/", {
        params: { environment, page_size: 1 },
      });
      return (response.data?.pagination?.total ?? 0) as number;
    },
    enabled: !!userEmail,
    staleTime: 30_000,
  });
}

function Overview() {
  const { userEmail, userName, kycStatus, accountLive } = useAuth();
  const environment = useEnvironment();
  const thisYear = new Date().getFullYear();
  const years = [thisYear, thisYear - 1, thisYear - 2];

  const [year, setYear] = useState(thisYear);
  const [yearOpen, setYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1",
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const { data: overview, isLoading } = useQuery({
    queryKey: ["overview", userEmail, environment],
    queryFn: async () =>
      unwrap<any>(
        await api.get("/analytics/overview/", { params: { environment } }),
      ),
    enabled: !!userEmail,
  });

  const { data: graph, isFetching: graphLoading } = useQuery({
    queryKey: ["overview-graph", userEmail, environment, year],
    queryFn: async () =>
      unwrap<any[]>(
        await api.get("/analytics/overview/graph/", {
          params: { year, environment },
        }),
      ),
    enabled: !!userEmail,
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-transactions", userEmail, environment],
    queryFn: async () =>
      (
        await api.get("/transactions/", {
          params: { environment, page_size: 5 },
        })
      ).data?.data as any[],
    enabled: !!userEmail,
  });

  const { data: account } = useQuery({
    queryKey: ["settings", userEmail],
    queryFn: async () => (await api.get("/accounts/user/details/")).data,
    enabled: !!userEmail,
  });

  const sandboxTotal = useTransactionTotal("sandbox");
  const liveTotal = useTransactionTotal("live");

  const collections = overview?.transactions;
  const payouts = overview?.payouts;
  const providers: any[] = overview?.provider_performance ?? [];
  const completed =
    (collections?.successful_transactions ?? 0) +
    (collections?.failed_transactions ?? 0);

  // ---- onboarding checklist, worked out from real account state
  const raw = account?.data || account || {};
  const merchantData = Array.isArray(raw.merchants)
    ? raw.merchants[0]
    : raw.merchants;
  const clients: any[] = merchantData?.api_clients ?? [];
  const providerCount = clients
    .filter((client) => {
      const env = String(client.environment ?? "").toLowerCase();
      return environment === "live"
        ? env === "live"
        : env === "sandbox" || env === "test";
    })
    .reduce((count, client) => count + (client.providers?.length ?? 0), 0);

  const steps = [
    {
      key: "provider",
      title: "Connect a payment provider",
      text: `Add your Paystack, Flutterwave or Nomba ${environment === "live" ? "live" : "test"} credentials.`,
      done: providerCount > 0,
      to: "/dashboard/providers",
      cta: "Connect provider",
    },
    {
      key: "test",
      title: "Send your first test request",
      text: "Call the API with your sandbox key and watch it appear here.",
      done: (sandboxTotal.data ?? 0) > 0,
      to: "/docs/installation",
      cta: "Read the quickstart",
    },
    {
      key: "kyc",
      title: "Verify your business",
      text: "Complete KYC to get live access.",
      done: kycStatus === "verified",
      to: "/dashboard/settings",
      state: { tab: "kyc" },
      cta: "Start verification",
    },
    {
      key: "live",
      title: "Go live",
      text: accountLive
        ? "Your account is live. The Test / Live switch only changes which data you see."
        : "Switched on for you once your business is verified. The Test / Live switch only changes which data you see.",
      done: accountLive,
    },
    {
      key: "first-live",
      title: "Process your first live transaction",
      text: "Use your live key to collect a payment or send a payout.",
      done: (liveTotal.data ?? 0) > 0,
      to: "/docs/initiate-payment",
      cta: "See the API",
    },
  ];
  const doneCount = steps.filter((step) => step.done).length;
  const showChecklist = !dismissed && doneCount < steps.length && !isLoading;
  const nextStep = steps.find((step) => !step.done);

  const chartData = (graph ?? []).map((month: any) => ({
    month: String(month.month ?? "").slice(0, 3),
    // a month with nothing completed has no rate, so leave a gap rather than plotting 0%
    success_rate: month.completed_transactions > 0 ? month.success_rate : null,
  }));
  const chartHasData = chartData.some(
    (point: any) => point.success_rate !== null,
  );

  const firstName = (userName || "").split(" ")[0];

  if (isLoading) return <LoadingBlock label="Loading your overview…" />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Overview"}
        description="A snapshot of your payments and payouts."
        actions={<EnvironmentBadge environment={environment} />}
      />

      {showChecklist && (
        <Card
          title={`Get started (${doneCount} of ${steps.length} done)`}
          description="A few steps to your first live transaction."
          action={
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(DISMISS_KEY, "1");
                setDismissed(true);
              }}
              aria-label="Dismiss checklist"
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          }
        >
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
          </div>
          <ol className="space-y-4">
            {steps.map((step) => (
              <li key={step.key} className="flex items-start gap-3">
                {step.done ? (
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                ) : (
                  <Circle className="mt-0.5 w-5 h-5 text-slate-300 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${step.done ? "text-slate-400 line-through" : "text-slate-900"}`}
                  >
                    {step.title}
                  </p>
                  {!step.done && (
                    <p className="text-xs text-slate-500 mt-0.5">{step.text}</p>
                  )}
                </div>
                {!step.done && step.to && step === nextStep && (
                  <Link
                    to={step.to}
                    state={step.state}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
                  >
                    {step.cta} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Payments received"
          value={formatNaira(collections?.total_value)}
          hint={`${formatNumber(collections?.successful_transactions)} successful payments`}
          icon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Success rate"
          value={completed > 0 ? collections?.success_rate : "—"}
          hint={
            completed > 0
              ? `${formatNumber(collections?.failed_transactions)} failed of ${formatNumber(completed)} completed`
              : "Shown once a payment completes"
          }
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Payments"
          value={formatNumber(collections?.total_transactions)}
          hint={`${formatNumber(collections?.in_progress_transactions)} in progress`}
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Payouts sent"
          value={formatNaira(payouts?.total_value)}
          hint={`${formatNumber(payouts?.total_transactions)} payouts, ${formatNumber(payouts?.in_progress_transactions)} in progress`}
          icon={<ArrowUpRight className="w-4 h-4 text-violet-600" />}
        />
      </div>

      {environment === "sandbox" && (sandboxTotal.data ?? 1) === 0 && (
        <Card
          title="Make your first test request"
          description="Use your sandbox key, then check the Transactions tab. No real money moves in test mode."
        >
          <CodeTabs snippets={testRequest} className="mb-0" />
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Success rate by month"
          description="Payments only, measured over completed payments"
          action={
            <div className="relative" ref={yearRef}>
              <button
                type="button"
                onClick={() => setYearOpen(!yearOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {year}
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${yearOpen ? "rotate-180" : ""}`}
                />
              </button>
              {yearOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                  {years.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setYear(option);
                        setYearOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                        option === year
                          ? "text-blue-600 font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          }
        >
          {chartHasData ? (
            <div
              className={`h-72 transition-opacity ${graphLoading ? "opacity-50" : ""}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 16, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                    width={44}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Success rate"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="success_rate"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#2563eb" }}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<LineChartIcon className="w-6 h-6" />}
              title={`No completed payments in ${year}`}
            >
              Your monthly success rate will be charted here once payments
              complete.
            </EmptyState>
          )}
        </Card>

        <Card
          padded={false}
          title="Provider performance"
          action={
            <Link
              to="/dashboard/analytics"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Details
            </Link>
          }
        >
          {providers.length === 0 ? (
            <EmptyState
              icon={<Server className="w-6 h-6" />}
              title="No provider data yet"
            >
              Provider results show here once payments are processed.
            </EmptyState>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium text-right">Payments</th>
                  <th className="px-4 py-3 font-medium text-right">Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((provider) => (
                  <tr key={provider.provider}>
                    <td className="px-4 py-3 font-medium text-slate-900 capitalize">
                      <span className="inline-flex items-center gap-2">
                        {provider.status === "poor" ? (
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : provider.status === "average" ? (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        {provider.provider || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatNumber(provider.total_transactions)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {provider.success_rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card
        padded={false}
        title="Recent activity"
        action={
          <Link
            to="/dashboard/transactions"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {recentLoading ? (
          <LoadingBlock />
        ) : !recent || recent.length === 0 ? (
          <EmptyState
            title={`No ${environment === "live" ? "live" : "test"} transactions yet`}
          >
            They appear here as soon as you send a request.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-slate-100">
                {recent.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <TypeBadge type={tx.transaction_type} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block font-medium text-slate-900 max-w-[220px] truncate">
                        {tx.reference || tx.transaction_id}
                      </span>
                      <span className="block text-xs text-slate-500 capitalize">
                        {tx.provider}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {tx.transaction_type === "payout" ? "−" : ""}
                      {formatAmount(tx.amount, tx.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 text-right whitespace-nowrap">
                      {timeAgo(tx.created_at)}
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

export default Overview;
