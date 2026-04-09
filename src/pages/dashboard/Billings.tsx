import {
  CreditCard,
  Download,
  CheckCircle2,
  Zap,
  History as HistoryIcon,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import {
  subscriptionPlans,
  invoices,
  monthlyUsage,
  apiCalls,
  billingHistory,
} from "../../data/billingData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <p className="text-sm font-bold text-slate-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs font-medium text-emerald-600 flex items-center justify-between gap-4">
            Successful Tx: <span className="font-bold">{payload[0].payload.successful.toLocaleString()}</span>
          </p>
          <p className="text-xs font-medium text-rose-600 flex items-center justify-between gap-4">
            Failed Tx: <span className="font-bold">{payload[0].payload.failed.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Billings = () => {
  const currentPlan = subscriptionPlans.find((p) => p.isCurrent) || null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Billing & Subscription</h1>
          <p className="text-slate-500 mt-1">Manage your plan, invoices, and track your transactions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-slate-200">
            <Download className="w-4 h-4" />
            Export Data
          </button>
            <Link 
              to="/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
            >
              <Zap className="w-4 h-4" />
              Upgrade Plan
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan & Usage */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-6 shadow-sm overflow-hidden relative transition-all duration-300 ${currentPlan ? "bg-white border-slate-200" : "bg-linear-to-br from-indigo-50 to-white border-blue-100 ring-1 ring-blue-50/50"
              }`}
          >
            {currentPlan ? (
              <>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CreditCard className="w-32 h-32 text-slate-900" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 text-blue-600 mb-4 font-semibold text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Active Subscription
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-4xl font-bold text-slate-900">₦{currentPlan.price.toLocaleString()}</h2>
                    <span className="text-slate-500 font-medium">/ {currentPlan.interval}</span>
                  </div>

                  <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
                    You are currently on the <span className="font-bold text-slate-900">{currentPlan.name}</span> plan. Your next billing date is <span className="text-slate-900 font-medium">April 15, 2024</span>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {currentPlan.features
                      .filter(f => !f.toLowerCase().includes('transaction'))
                      .map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          {feature}
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <Link 
                      to="/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change Plan
                    </Link>
                    <div className="w-px h-4 bg-slate-200 my-auto"></div>
                    <button className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative py-4">
                <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-xs ring-4 ring-blue-50">
                    <Zap className="w-8 h-8 fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">No Active Subscription</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    You're currently using the default pay-as-you-go model. Subscribe to unlock analytics and other premium features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link 
                      to="/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
                    >
                      View Available Plans
                    </Link>
                    <button className="flex-1 px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-200">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Transaction Insights</h3>
                <p className="text-sm text-slate-500">Real-time accumulation of successful and failed transactions.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button className="px-3 py-1 text-xs font-medium bg-white text-slate-900 rounded shadow-sm border border-slate-200">Volume</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">Revenue</button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: '#F8FAFC' }}
                  />
                  <Bar
                    dataKey="successful"
                    radius={[6, 6, 6, 6]}
                    barSize={40}
                  >
                    {monthlyUsage.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === monthlyUsage.length - 1 ? '#2563EB' : '#DBEAFE'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Current Month (Successful)</p>
                <p className="text-xl font-bold text-slate-900">{monthlyUsage[monthlyUsage.length - 1].successful.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +21%
                </p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Est. Next Bill</p>
                <p className="text-xl font-bold text-slate-900">₦{(monthlyUsage[monthlyUsage.length - 1].successful * 10).toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 font-medium">Due Apr 15</p>
              </div>
            </div>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Transactions</h3>
                <p className="text-sm text-slate-500 mb-0">List of recent successful and failed transactions.</p>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{call.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${call.route === 'auto' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                          {call.route}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{call.timestamp}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${call.status === 'success' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${call.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`} />
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">₦{call.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Invoices & History */}
        <div className="space-y-8">
          {/* Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Recent Invoices</h3>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-colors border border-transparent group-hover:border-slate-100">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{invoice.id}</p>
                      <p className="text-xs text-slate-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">₦{invoice.amount.toLocaleString()}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded font-bold uppercase">
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-colors border-t border-slate-100">
              View Invoice History
            </button>
          </motion.div>

          {/* Billing History / Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Billing History</h3>
              <HistoryIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-6">
              {billingHistory.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== billingHistory.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-100"></div>
                  )}
                  <div className="w-[22px] h-[22px] rounded-full bg-slate-100 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-slate-900 truncate pr-2">{item.event}</p>
                      <span className={`text-xs font-bold ${item.amount.startsWith('-') ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support Widget */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Need help with billing?</h4>
            <p className="text-sm text-slate-600 mb-4">
              Schedule a call with our accounts team for custom enterprise pricing or to resolve invoice issues.
            </p>
            <Link 
              to="/dashboard/support-ticket"
              className="w-full py-2.5 bg-white text-blue-600 text-sm font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billings;
