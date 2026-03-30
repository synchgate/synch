import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Server,
  TrendingDown,
  TrendingUp,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", success_rate: 94 },
  { month: "Feb", success_rate: 96 },
  { month: "Mar", success_rate: 95 },
  { month: "Apr", success_rate: 92 },
  { month: "May", success_rate: 97 },
  { month: "Jun", success_rate: 98 },
  { month: "Jul", success_rate: 96 },
];

function Overview() {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = ["2023", "2024", "2025", "2026"];

  const {
    data: overviewResponse,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["overview", userEmail],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get(`/analytics/overview/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userEmail,
  });

  const {
    data: graphResponse,
    isFetching: isGraphFetching,
  } = useQuery({
    queryKey: ["overview-graph", userEmail, selectedYear],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get(`/analytics/overview/graph/?year=${selectedYear}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userEmail,
  });

  console.log("Raw API Response (overviewResponse):", overviewResponse);
  console.log("Graph API Response (graphResponse):", graphResponse);

  const overviewData = overviewResponse?.data ||
    overviewResponse || {
    transactions: {
      total_transactions: 0,
      successful_transactions: 0,
      failed_transactions: 0,
      success_rate: "0%",
      total_value: 0,
    },
    provider_performance: [],
    provider_success_graph: [],
  };

  const { transactions, provider_performance } = overviewData;

  // Use graphResponse for the chart data
  const graphDataFromApi = graphResponse?.data || graphResponse?.provider_success_graph || [];

  const displayedChartData = graphDataFromApi.length
    ? graphDataFromApi.map((d: any) => ({
      month: d.month || "Unknown",
      success_rate:
        typeof d.success_rate === "string"
          ? parseFloat(d.success_rate.replace("%", ""))
          : d.success_rate || 0,
    }))
    : chartData;

  console.log("Raw API Response (overviewResponse):", overviewResponse);
  console.log("Extracted overviewData:", overviewData);
  console.log("Extracted provider_performance:", provider_performance);
  if (isError) {
    console.error("API Error fetching overview:", error);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
            Overview Snapshot
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Quick health snapshot of your payment operations.
          </p>
        </div>
      </div>

      {/* Metric Cards (Top Row) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Transactions",
            value: transactions.total_transactions?.toLocaleString() || "0",
            trend: "+0%",
            color: "text-emerald-600",
            up: true,
          },
          {
            label: "Successful tx",
            value:
              transactions.successful_transactions?.toLocaleString() || "0",
            trend: "+0%",
            color: "text-emerald-600",
            up: true,
          },
          {
            label: "Failed tx",
            value: transactions.failed_transactions?.toLocaleString() || "0",
            trend: "-0%",
            color: "text-emerald-600",
            up: false,
          },
          {
            label: "Success Rate",
            value: transactions.success_rate || "0%",
            trend: "+0%",
            color: "text-blue-600",
            up: true,
          },
          {
            label: "Total Value",
            value: `₦${transactions.total_value?.toLocaleString() || "0"}`,
            trend: "+0%",
            color: "text-emerald-600",
            up: true,
          },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => navigate("/dashboard/transactions")}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <span className="text-xs font-medium text-slate-500 mb-3 block">
              {stat.label}
            </span>
            <div className="flex items-end justify-between">
              <span className="font-['Outfit'] text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {stat.value}
              </span>
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${stat.color} bg-slate-50`}
              >
                {stat.up ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Success Rate Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Success Rate Trend
              (Yearly)
            </h3>

            {/* Year Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              >
                {selectedYear}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${selectedYear === year ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            {/* Chart Loader Overlay */}
            {isGraphFetching && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl animate-in fade-in duration-200">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="text-xs font-medium text-slate-500">Updating data...</span>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayedChartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
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
                  dy={10}
                  tickFormatter={(val) => val.substring(0, 3)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  domain={[80, 100]}
                  dx={-10}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="success_rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#2563eb",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" /> Provider Performance
            </h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium text-right">Total TX</th>
                  <th className="px-4 py-3 font-medium text-right">SR %</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {provider_performance?.length > 0 ? (
                  provider_performance.map((provider: any, idx: number) => {
                    const name =
                      provider.provider ||
                      provider.provider_name ||
                      provider.name ||
                      "Unknown";
                    const tx = provider.total_transactions ?? provider.tx ?? 0;
                    const sr = provider.success_rate || provider.rate || "-";
                    const status = (provider.status || "good").toLowerCase();

                    let statusTextColor = "text-emerald-600";
                    let StatusIcon = CheckCircle2;

                    if (status === "poor") {
                      statusTextColor = "text-red-500";
                      StatusIcon = XCircle;
                    } else if (status === "average") {
                      statusTextColor = "text-amber-500";
                      StatusIcon = Clock;
                    }

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 capitalize">
                          {name}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {tx.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {sr}
                        </td>
                        <td className="px-4 py-3 pb-3 text-center flex justify-center mt-1">
                          <div
                            className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${statusTextColor}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-slate-500 text-sm"
                    >
                      No provider data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 p-3 text-center">
            <Link
              to="/dashboard/providers"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors cursor-pointer group"
            >
              View detailed routing metrics
              <ArrowUpRight className="w-3 h-3 ml-1 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
