import { ArrowRight, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

function Authentication() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Authentication
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The SynchGate API uses secret keys to authenticate requests. You can view
        and manage your API keys in the SynchGate Dashboard.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-10 flex gap-4 text-yellow-800 shadow-sm">
        <KeyRound className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold mb-1">Keep your keys safe</h4>
          <p className="text-sm">
            Your secret keys carry many privileges, so be sure to keep them
            confidential! Do not share your secret keys in publicly accessible
            areas such as GitHub, client-side code, and so forth.
          </p>
        </div>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 border-b border-slate-200 pb-2 text-black">
        Authenticating requests
      </h2>
      <p className="text-slate-600 mb-6">
        Depending on the framework or SDK you are using, you will supply your
        API key during initialization. All API requests must be made over HTTPS.
        Calls made over plain HTTP will fail. API requests without
        authentication will also fail.
      </p>

      <div className="relative rounded-2xl overflow-hidden mb-12 border border-slate-200 shadow-lg">
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <div className="text-xs text-slate-500 ml-2 font-mono">init.ts</div>
        </div>
        <pre className="text-sm font-mono text-slate-800 bg-white p-6 overflow-x-auto shadow-inner">
          <code>
            <span className="text-pink-600">import</span> &#123; SynchGate &#125;{" "}
            <span className="text-pink-600">from</span>{" "}
            <span className="text-blue-600">'@synchgate/node'</span>;<br />
            <br />
            <span className="text-slate-400">
              // Initialize with your secret key
            </span>
            <br />
            <span className="text-blue-700">const</span> SynchGate ={" "}
            <span className="text-pink-600">new</span>{" "}
            <span className="text-amber-600">SynchGate</span>(
            <span className="text-blue-600">'pf_test_xxyz123abc'</span>);
            <br />
          </code>
        </pre>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/installation"
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
              Installation
            </span>
          </div>
        </Link>
        <a
          href="#"
          className="flex items-center justify-end gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Create a Charge
            </span>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Authentication;
