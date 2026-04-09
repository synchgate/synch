import { Database, Search, ShieldAlert, Terminal } from "lucide-react";

function Logs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          Developer Logs
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Deep dive into provider requests, responses, and webhook events.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200 shrink-0">
            <Terminal className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live Logs & Debugging
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect raw API requests and responses.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-md">
              <Terminal className="w-9 h-9 text-indigo-400" />
            </div>
            <span className="absolute -top-2 -right-2 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500 items-center justify-center">
                <span className="text-white text-[9px] font-bold">!</span>
              </span>
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
            Coming Soon
          </span>

          <h4 className="text-lg font-bold text-slate-900 mb-2">
            The Logging Console is coming soon
          </h4>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            We're building a powerful, real-time logging engine that will let
            you trace every single request across all providers with millisecond
            precision.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { icon: Search, label: "Advanced Search" },
              { icon: Database, label: "Raw Payloads" },
              { icon: ShieldAlert, label: "Error Tracing" },
            ].map((item) => (
              <div
                key={item.label}
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

export default Logs;
