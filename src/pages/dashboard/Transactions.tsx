import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Search,
  Server,
  X,
  XCircle,
  Loader2,
  Zap,
  GitBranch,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

function Transactions() {
  const { userEmail } = useAuth();
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All Providers");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("All Routes");

  const { data: transactionsResponse, isLoading } = useQuery({
    queryKey: ["transactions", userEmail],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/transactions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userEmail,
  });

  const transactions = transactionsResponse?.data || [];

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch =
      tx.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const provider = (
      tx.final_provider ||
      tx.preferred_provider ||
      ""
    ).toLowerCase();
    const providerFilter = selectedProvider.toLowerCase();
    const matchesProvider =
      selectedProvider === "All Providers" || provider === providerFilter;

    const status = (tx.status || "").toLowerCase();
    const statusFilter = selectedStatus.toLowerCase();
    const matchesStatus =
      selectedStatus === "All Statuses" || status === statusFilter;

    let matchesDate = true;
    if (startDate || endDate) {
      const txDate = new Date(tx.created_at);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of day
        if (txDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        if (txDate > end) matchesDate = false;
      }
    }

    const routeType = (tx.route_type || "basic").toLowerCase();
    const routeFilter = selectedRoute.toLowerCase();
    const matchesRoute =
      selectedRoute === "All Routes" || routeType === routeFilter;

    return (
      matchesSearch &&
      matchesProvider &&
      matchesStatus &&
      matchesDate &&
      matchesRoute
    );
  });

  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount || "0");
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: (currency || "ngn").toUpperCase(),
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const formattedStatus = status?.toLowerCase();
    if (formattedStatus === "success")
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
          <CheckCircle2 className="w-3 h-3" /> Success
        </span>
      );
    if (formattedStatus === "failed")
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded uppercase">
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
        <Clock className="w-3 h-3" />{" "}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative">
      {/* Header & Filters */}
      <div className="shrink-0 space-y-4 mb-6">
        <div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
            Transactions
          </h1>
          <p className="text-slate-600 text-sm">
            Monitor all transaction attempts across providers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-500 text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Providers">All Providers</option>
              <option value="Paystack">Paystack</option>
              <option value="Flutterwave">Flutterwave</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Routes">All Routes</option>
              <option value="Basic">Basic</option>
              <option value="Auto">Auto</option>
            </select>
            {(startDate ||
              endDate ||
              selectedProvider !== "All Providers" ||
              selectedStatus !== "All Statuses" ||
              selectedRoute !== "All Routes" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSearchTerm("");
                  setSelectedProvider("All Providers");
                  setSelectedStatus("All Statuses");
                  setSelectedRoute("All Routes");
                }}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative z-10 w-full mb-10">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Provider</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Channel</th>
                  <th className="px-6 py-4 font-medium text-center">Route</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  {/* <th className="px-6 py-4 font-medium">Reason</th> */}
                  <th className="px-6 py-4 font-medium text-left">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx: any) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 font-medium">
                        {tx.transaction_id}
                      </td>
                      <td className="px-6 py-4 text-slate-900 flex items-center gap-2 font-medium capitalize">
                        <Server className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {tx.final_provider || tx.preferred_provider || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 capitalize">
                        {tx.channel || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            (tx.route_type || "basic").toLowerCase() === "auto"
                              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {(tx.route_type || "basic").toLowerCase() ===
                          "auto" ? (
                            <Zap className="w-2.5 h-2.5" />
                          ) : (
                            <GitBranch className="w-2.5 h-2.5" />
                          )}
                          {tx.route_type || "Basic"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      {/* <td className="px-6 py-4 text-slate-500 text-xs">
                        {tx.message || "-"}
                      </td> */}
                      <td className="px-6 py-4 text-slate-500 text-left whitespace-nowrap">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-slate-50 border-t border-slate-200 p-3 px-6 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </span>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm cursor-pointer disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal Overlay */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTx(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Transaction Details
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {selectedTx.transaction_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-between border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                    Amount Processed
                  </p>
                  <p className="font-['Outfit'] text-3xl font-bold text-slate-900">
                    {formatCurrency(selectedTx.amount, selectedTx.currency)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <StatusBadge status={selectedTx.status} />
                  <p className="text-xs text-slate-500 font-medium">
                    {formatDate(selectedTx.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Overview
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Provider</p>
                    <p className="font-medium text-slate-900 capitalize">
                      {selectedTx.final_provider ||
                        selectedTx.preferred_provider ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Channel</p>
                    <p className="font-medium text-slate-900 capitalize">
                      {selectedTx.channel || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Routing Mode</p>
                    <div className="flex items-center gap-1.5 font-medium text-slate-900 capitalize">
                      {(selectedTx.route_type || "basic").toLowerCase() ===
                      "auto" ? (
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                      ) : (
                        <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      {selectedTx.route_type || "Basic"}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">
                      Customer Email
                    </p>
                    <p className="font-medium text-slate-900 truncate">
                      {selectedTx.customer_email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Message</p>
                    <p className="font-medium text-slate-900">
                      {selectedTx.message || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-start gap-4 text-sm z-10">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-white ring-4 ring-white shadow-sm mt-0.5">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <div className="bg-white border text-left flex-1 p-3 rounded-xl border-slate-200 shadow-sm">
                      <p className="font-medium text-slate-900">
                        Request Initiated
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        SynchGate engine receives standard /charge payload
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4 text-sm z-10">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-white ring-4 ring-white shadow-sm mt-0.5">
                      <Server className="w-3 h-3" />
                    </div>
                    <div className="bg-white border text-left flex-1 p-3 rounded-xl border-slate-200 shadow-sm">
                      <p className="font-medium text-slate-900">
                        Provider Match
                      </p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        Routed to {selectedTx.final_provider} Based on Merchant
                        Request state
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4 text-sm z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white ring-4 ring-white shadow-sm mt-0.5 ${selectedTx.status?.toLowerCase() === "success" ? "bg-emerald-100 text-emerald-600" : selectedTx.status?.toLowerCase() === "failed" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
                    >
                      {selectedTx.status?.toLowerCase() === "success" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                    </div>
                    <div className="bg-white border text-left flex-1 p-3 rounded-xl border-slate-200 shadow-sm">
                      <p className="font-medium text-slate-900">
                        Final Outcome
                      </p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        Provider returned status: {selectedTx.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Provider Response (Raw)
                  </h3>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(
                          selectedTx.metadata || selectedTx,
                          null,
                          2,
                        ),
                      )
                    }
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy JSON
                  </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                  <pre className="text-xs text-slate-300 font-mono text-left whitespace-pre-wrap">
                    {JSON.stringify(selectedTx.metadata || selectedTx, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
