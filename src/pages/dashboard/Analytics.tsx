import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
  SegmentedControl,
  StatCard,
} from "../../components/dashboard/ui";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  formatNaira,
  formatNumber,
  titleCase,
  unwrap,
  useEnvironment,
} from "../../lib/dashboard";

type Days = "7" | "30" | "90";

const STATUS_COLORS: Record<string, string> = {
  success: "#10b981",
  failed: "#ef4444",
  abandoned: "#94a3b8",
  processing: "#3b82f6",
  pending: "#f59e0b",
  retrying: "#f59e0b",
};

const ROUTE_LABELS: Record<string, string> = {
  basic: "Chosen by you",
  smart_policy: "Smart Route rule",
  smart_score: "Smart Route score",
};

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

const compactNaira = (value: number) =>
  value >= 1_000_000
    ? `₦${(value / 1_000_000).toFixed(1)}m`
    : value >= 1000
      ? `₦${(value / 1000).toFixed(0)}k`
      : `₦${value}`;

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  fontSize: 12,
};

function Analytics() {
  const { userEmail } = useAuth();
  const environment = useEnvironment();
  const [days, setDays] = useState<Days>("30");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics-summary", userEmail, environment, days],
    queryFn: async () => {
      const response = await api.get("/analytics/summary/", {
        params: { environment, days },
      });
      return unwrap<any>(response);
    },
    enabled: !!userEmail,
  });

  const collections = data?.collections;
  const payouts = data?.payouts;
  const series: any[] = data?.series ?? [];
  const byProvider: any[] = data?.by_provider ?? [];
  const byStatus: Record<string, number> = data?.by_status ?? {};
  const byRoute: Record<string, number> = data?.by_route ?? {};

  const hasActivity =
    (collections?.total_transactions ?? 0) +
      (payouts?.total_transactions ?? 0) >
    0;

  const statusData = Object.entries(byStatus).map(([name, value]) => ({
    name,
    value,
  }));
  const routeTotal = Object.values(byRoute).reduce((sum, n) => sum + n, 0);
  const completed =
    (collections?.successful_transactions ?? 0) +
    (collections?.failed_transactions ?? 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Analytics"
        description="How your payments and payouts are performing."
        actions={
          <div className="flex items-center gap-3">
            <EnvironmentBadge environment={environment} />
            <SegmentedControl<Days>
              label="Period"
              value={days}
              onChange={setDays}
              options={[
                { value: "7", label: "7 days" },
                { value: "30", label: "30 days" },
                { value: "90", label: "90 days" },
              ]}
            />
          </div>
        }
      />

      {isLoading ? (
        <LoadingBlock label="Loading analytics…" />
      ) : isError ? (
        <Card padded={false}>
          <EmptyState
            icon={<BarChart3 className="w-6 h-6" />}
            title="Analytics are unavailable right now"
          >
            We couldn't load your numbers. Please refresh and try again.
          </EmptyState>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Payments received"
              value={formatNaira(collections?.total_value)}
              hint={`${formatNumber(collections?.successful_transactions)} successful`}
              icon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Payouts sent"
              value={formatNaira(payouts?.total_value)}
              hint={`${formatNumber(payouts?.successful_transactions)} completed`}
              icon={<ArrowUpRight className="w-4 h-4 text-violet-600" />}
            />
            <StatCard
              label="Success rate"
              value={completed > 0 ? collections?.success_rate : "—"}
              hint={
                completed > 0
                  ? `of ${formatNumber(completed)} completed payments`
                  : "No completed payments yet"
              }
              icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Payments"
              value={formatNumber(collections?.total_transactions)}
              hint={`${formatNumber(collections?.in_progress_transactions)} in progress`}
              icon={<Clock className="w-4 h-4 text-amber-500" />}
            />
          </div>

          {!hasActivity ? (
            <Card padded={false}>
              <EmptyState
                icon={<BarChart3 className="w-6 h-6" />}
                title={`No ${environment === "live" ? "live" : "test"} activity in this period`}
                action={
                  <Link
                    to="/docs/installation"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    Make your first request
                  </Link>
                }
              >
                Charts appear here as soon as you process payments or send
                payouts.
              </EmptyState>
            </Card>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card
                  title="Payments per day"
                  description="Successful and failed payments"
                >
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={series}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={shortDate}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          minTickGap={24}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          width={32}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          labelFormatter={(label) => shortDate(String(label))}
                        />
                        <Bar
                          dataKey="collections_successful"
                          name="Successful"
                          stackId="payments"
                          fill="#10b981"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="collections_failed"
                          name="Failed"
                          stackId="payments"
                          fill="#ef4444"
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card
                  title="Money in and out"
                  description="Successful payments received and payouts sent"
                >
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series}>
                        <defs>
                          <linearGradient
                            id="inFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#10b981"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#10b981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="outFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#8b5cf6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={shortDate}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          minTickGap={24}
                        />
                        <YAxis
                          tickFormatter={compactNaira}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          width={48}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          labelFormatter={(label) => shortDate(String(label))}
                          formatter={(value) => formatNaira(Number(value))}
                        />
                        <Area
                          type="monotone"
                          dataKey="collections_value"
                          name="Received"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#inFill)"
                        />
                        <Area
                          type="monotone"
                          dataKey="payouts_value"
                          name="Sent"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="url(#outFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card
                  className="lg:col-span-2"
                  padded={false}
                  title="Provider comparison"
                  description="Payments only. Success rate is measured over completed payments."
                >
                  {byProvider.length === 0 ? (
                    <EmptyState title="No payments in this period" />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                          <tr>
                            <th className="px-5 py-3 font-medium">Provider</th>
                            <th className="px-5 py-3 font-medium text-right">
                              Payments
                            </th>
                            <th className="px-5 py-3 font-medium">
                              Success rate
                            </th>
                            <th className="px-5 py-3 font-medium text-right">
                              Received
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {byProvider.map((row) => (
                            <tr key={row.provider}>
                              <td className="px-5 py-3.5 font-medium text-slate-900 capitalize">
                                {row.provider || "—"}
                              </td>
                              <td className="px-5 py-3.5 text-right text-slate-600">
                                {formatNumber(row.total)}
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3 min-w-[160px]">
                                  <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        row.status === "good"
                                          ? "bg-emerald-500"
                                          : row.status === "average"
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                      }`}
                                      style={{ width: `${row.success_rate}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-700 w-12 text-right">
                                    {row.success_rate}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                                {formatNaira(row.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                <div className="space-y-6">
                  <Card title="Outcomes" description="All payments and payouts">
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={38}
                            outerRadius={62}
                            paddingAngle={2}
                          >
                            {statusData.map((entry) => (
                              <Cell
                                key={entry.name}
                                fill={STATUS_COLORS[entry.name] ?? "#cbd5e1"}
                              />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {statusData.map((entry) => (
                        <li
                          key={entry.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-2 text-slate-600">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                background:
                                  STATUS_COLORS[entry.name] ?? "#cbd5e1",
                              }}
                            />
                            {titleCase(entry.name)}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatNumber(entry.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card title="How payments were routed">
                    {routeTotal === 0 ? (
                      <p className="text-sm text-slate-500">
                        No payments in this period.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {Object.entries(byRoute).map(([route, count]) => (
                          <li key={route}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600">
                                {ROUTE_LABELS[route] ?? titleCase(route)}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatNumber(count)}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                  width: `${(count / routeTotal) * 100}%`,
                                }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
            <p>
              Deeper insights such as failure reasons, results by bank and time
              of day, and revenue lost to failed payments are coming soon.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
