import { Building2, Activity, ShieldCheck } from "lucide-react";

function Analytics() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          Business Analytics
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Monitor your business performance and real-time transaction insights.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shrink-0">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Performance Insights
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring and analytics.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center shadow-md">
              <Activity className="w-9 h-9 text-blue-400" />
            </div>
            <span className="absolute -top-2 -right-2 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 items-center justify-center">
                <span className="text-white text-[9px] font-bold">!</span>
              </span>
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-4">
            Coming Soon
          </span>

          <h4 className="text-lg font-bold text-slate-900 mb-2">
            Advanced Analytics is coming soon
          </h4>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            We're building a comprehensive analytics dashboard for all your
            payment transactions. Soon you'll be able to monitor volume, success
            rates, and customer trends in real-time.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { icon: Activity, label: "Volume Trends" },
              { icon: ShieldCheck, label: "Fraud Detection" },
              { icon: Building2, label: "Settlement reports" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
