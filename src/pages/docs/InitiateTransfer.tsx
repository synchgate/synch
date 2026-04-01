import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function InitiateTransfer() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          TRANSFER
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Initiate Transfer
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Coming soon... This endpoint allows you to initiate an outbound transfer to a specified bank account.
      </p>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/resolve-account"
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
              Resolve Account
            </span>
          </div>
        </Link>
        <div></div>
      </div>
    </div>
  );
}

export default InitiateTransfer;
