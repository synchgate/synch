import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/ui/CopyButton";
import { SimpleExample } from "../../components/docs/SimpleExample";

function Installation() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Installation
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        To begin using the SynchGate API:
      </p>

      <ol className="list-decimal list-inside space-y-3 mb-12 text-slate-600 text-lg ml-2">
        <li>Obtain your API keys</li>
        <li>Send payment requests to our API</li>
        <li>Specify the provider in your request payload</li>
      </ol>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Base URL
      </h2>

      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-amber-200 mb-6 shadow-inner overflow-x-auto relative group flex items-center justify-between">
        <span>https://api.synchgate.com/v1</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="https://api.synchgate.com/v1" />
        </div>
      </div>

      <p className="text-slate-600 mb-12">Local development example:</p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Authentication
      </h2>
      <p className="text-slate-600 mb-6">
        All requests must include your <strong>Client Secret Key</strong>.
      </p>

      <h3 className="font-semibold text-slate-900 text-xl mb-3">Header</h3>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-slate-300 mb-12 shadow-inner overflow-x-auto space-y-2">
        <div>
          <span className="text-emerald-300">Client-Secret-Key:</span>{" "}
          synch_live_xxxxxxxx
        </div>
      </div>

      <p className="text-slate-900 font-bold text-lg mb-2 mt-8">Example</p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton
            textToCopy={`curl --location 'http://payinfraterminal.onrender.com/v1/api/initiate-payment/' \\\n--header 'Client-Secret-Key: pit_sk_live_U2C8HtHdlHPRvHcjRBYBYn9DyZPJEf2o_xZqQkUFIf0' \\\n--header 'Content-Type: application/json' `}
          />
        </div>
        <pre>
          {`curl --location 'http://payinfraterminal.onrender.com/v1/api/initiate-payment/' \\
--header 'Client-Secret-Key: pit_sk_live_U2C8HtHdlHPRvHcjRBYBYn9DyZPJEf2o_xZqQkUFIf0' \\
--header 'Content-Type: application/json' `}
        </pre>
      </div>

      <p className="text-slate-600 mb-3">
        If authentication fails, the API will return:
      </p>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-12 shadow-inner overflow-x-auto border border-white/10">
        401 Unauthorized
      </div>

      <SimpleExample />

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Provider Performance Metrics
      </h2>
      <p className="text-slate-600 mb-4">
        The platform tracks key provider performance metrics including:
      </p>
      <ul className="space-y-1 mb-6 text-slate-600 list-disc list-inside ml-2">
        <li>total transactions</li>
        <li>success rate</li>
        <li>failure rate</li>
        <li>average latency</li>
      </ul>
      <p className="text-slate-600 mb-12">
        These metrics will be used in future versions to power{" "}
        <strong>automatic routing decisions</strong> and smart failover
        mechanisms.
      </p>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/authentication"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600 rotate-180" />
          </div>
          <div className="text-left min-w-0 pr-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Previous
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Authentication
            </span>
          </div>
        </Link>
        <Link
          to="/docs/initiate-payment"
          className="flex items-center justify-end gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Initiate Payment
            </span>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Installation;
