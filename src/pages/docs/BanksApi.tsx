import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/ui/CopyButton";

function BanksApi() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          TRANSFER
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Banks API
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Retrieve a list of supported banks for transfers using a specific provider.
      </p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Base URL
      </h2>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between">
        <span>https://api.synchgate.com/v1/api</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="https://api.synchgate.com/v1/api" />
        </div>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 border-b border-slate-200 pb-2 text-black">
        Endpoint
      </h2>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between">
        <span>POST /banks/</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="POST /banks/" />
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg mb-3">
        Request Payload
      </h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`{\n    "provider": "flutterwave"\n}`} />
        </div>
        <pre>
          {`{
    "provider": "flutterwave"
}`}
        </pre>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Example Response
      </h2>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`{\n    "status": "success",\n    "message": "List of NGN banks",\n    "data": [\n        {\n            "name": "Enterprise Bank",\n            "code": "000019"\n        },\n        {\n            "name": "Titan Trust Bank",\n            "code": "000025"\n        },\n        {\n            "name": "Taj Bank Limited",\n            "code": "000026"\n        },\n        {\n            "name": "Globus Bank",\n            "code": "000027"\n        }\n    ],\n    "meta": {\n        "request_id": "f7d3ad77-f327-4314-9c64-00501d9ebaec",\n        "timestamp": "2026-04-01T12:44:01.060968Z"\n    }\n}`} />
        </div>
        <pre>
          {`{
    "status": "success",
    "message": "List of NGN banks",
    "data": [
        {
            "name": "Enterprise Bank",
            "code": "000019"
        },
        {
            "name": "Titan Trust Bank",
            "code": "000025"
        },
        {
            "name": "Taj Bank Limited",
            "code": "000026"
        },
        {
            "name": "Globus Bank",
            "code": "000027"
        }
    ],
    "meta": {
        "request_id": "f7d3ad77-f327-4314-9c64-00501d9ebaec",
        "timestamp": "2026-04-01T12:44:01.060968Z"
    }
}`}
        </pre>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/transaction-verification"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
          <div className="text-left min-w-0 pr-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Previous
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Transaction Verification
            </span>
          </div>
        </Link>
        <Link
          to="/docs/resolve-account"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0 justify-end text-right"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Resolve Account
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

export default BanksApi;
