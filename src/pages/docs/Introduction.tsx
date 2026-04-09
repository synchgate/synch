import {
  ArrowRight,
  Settings,
  Layers,
  ShieldCheck,
  FileJson,
} from "lucide-react";
import { Link } from "react-router-dom";

function Introduction() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          SynchGate v2.0 Docs
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Overview
      </h1>

      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 mb-10 text-lg">
        <p>
          SynchGate Platform is a{" "}
          <strong>Payment Intelligence & Infrastructure API</strong> that allows
          developers and businesses to integrate multiple payment providers
          through a <strong>single unified API</strong>.
        </p>
        <p>
          Instead of integrating separately with providers such as Paystack,
          Flutterwave, or Nomba, developers integrate <strong>once</strong> with
          SynchGate. The platform then routes transactions to the appropriate
          provider.
        </p>
        <p>
          Our infrastructure is designed to simplify payment integration while
          enabling businesses to build resilient payment systems.
        </p>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Key Capabilities
      </h2>

      <ul className="space-y-3 mb-12 text-slate-600 list-disc list-inside ml-2">
        <li>Single API for multiple payment providers</li>
        <li>Unified transaction response format</li>
        <li>Provider-based routing</li>
        <li>Standardized payment initialization</li>
        <li>Simplified integration for engineering teams</li>
        <li>Extensible architecture for smart routing and failover</li>
      </ul>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        How It Works
      </h2>

      <p className="text-slate-600 mb-6">
        Traditional payment integrations require developers to integrate and
        maintain multiple payment gateways individually.
      </p>

      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-6 overflow-x-auto shadow-inner leading-relaxed">
        <div>
          Merchant → <span className="text-blue-400">Paystack</span>
        </div>
        <div>
          Merchant → <span className="text-emerald-400">Flutterwave</span>
        </div>
        <div>
          Merchant → <span className="text-amber-400">Nomba</span>
        </div>
      </div>

      <p className="text-slate-600 mb-4">Each provider has:</p>
      <ul className="space-y-2 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>Different APIs</li>
        <li>Different authentication</li>
        <li>Different response formats</li>
        <li>Different failure behaviours</li>
      </ul>

      <p className="text-slate-600 mb-6">
        SynchGate Platform simplifies this with a{" "}
        <strong>single integration layer</strong>.
      </p>

      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner">
        <div>
          Merchant → <span className="text-indigo-400">synchgate API</span> →{" "}
          <span className="text-blue-400">Payment Provider</span>
        </div>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Architecture Overview
      </h2>

      <p className="text-slate-600 mb-6">
        The platform acts as a{" "}
        <strong>middleware payment infrastructure layer</strong>.
      </p>

      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed">
        <pre>
          {`Client Application
    |
    |
    ▼
SynchGate API
    |
    |-- Paystack
    |-- Flutterwave
    |-- Nomba
    └── Other Providers`}
        </pre>
      </div>

      <p className="text-slate-900 font-semibold mb-6 text-lg">
        Core components:
      </p>

      <div className="space-y-8 mb-12">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" /> API Gateway
          </h3>
          <p className="text-slate-600 mb-2">
            Handles all merchant requests including:
          </p>
          <ul className="list-disc list-inside text-slate-600 ml-2 space-y-1">
            <li>authentication</li>
            <li>request validation</li>
            <li>routing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> Provider Adapter
            Layer
          </h3>
          <p className="text-slate-600 mb-2">
            Each payment provider has its own adapter responsible for:
          </p>
          <ul className="list-disc list-inside text-slate-600 ml-2 space-y-1">
            <li>request transformation</li>
            <li>API communication</li>
            <li>response normalization</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" /> Transaction Engine
          </h3>
          <p className="text-slate-600 mb-2">Responsible for:</p>
          <ul className="list-disc list-inside text-slate-600 ml-2 space-y-1">
            <li>recording transaction metadata</li>
            <li>tracking payment state</li>
            <li>storing provider response</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-amber-500" /> Response Normalizer
          </h3>
          <p className="text-slate-600">
            All provider responses are converted into a{" "}
            <strong>standardized format</strong> returned to the merchant.
          </p>
        </div>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Why SynchGate Platform
      </h2>
      <p className="text-slate-600 mb-4">
        Payment reliability is critical for digital businesses.
      </p>
      <p className="text-slate-600 mb-4">
        Single-provider integrations create a{" "}
        <strong>single point of failure</strong>.
      </p>
      <p className="text-slate-600 mb-6">
        SynchGate Platform removes that risk by enabling{" "}
        <strong>multi-provider payment infrastructure through one API</strong>.
      </p>
      <p className="text-slate-900 font-semibold mb-2">Benefits:</p>
      <ul className="space-y-1 mb-12 text-slate-600 list-disc list-inside ml-2">
        <li>faster integration</li>
        <li>improved payment reliability</li>
        <li>simplified engineering maintenance</li>
        <li>consistent developer experience</li>
      </ul>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Use Cases
      </h2>
      <p className="text-slate-600 mb-6">SynchGate Platform is ideal for:</p>

      <div className="space-y-6 mb-12">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            Startups
          </h3>
          <p className="text-slate-600">
            Avoid building multiple PSP integrations.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            Marketplaces
          </h3>
          <p className="text-slate-600">Ensure high payment success rates.</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            High-volume businesses
          </h3>
          <p className="text-slate-600">
            Automatically route transactions to the most reliable provider.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            Fintech companies
          </h3>
          <p className="text-slate-600">
            Build payment orchestration infrastructure quickly.
          </p>
        </div>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Roadmap
      </h2>
      <p className="text-slate-600 mb-4">
        The current MVP supports <strong>manual provider routing</strong>.
      </p>
      <p className="text-slate-600 mb-6">
        Future versions of the platform will introduce a{" "}
        <strong>Payment Intelligence Engine</strong>.
      </p>
      <h3 className="font-semibold text-slate-900 text-lg mb-3">
        Planned Features
      </h3>
      <ul className="space-y-3 mb-8 text-slate-600 list-none ml-2">
        <li>Smart routing engine</li>
        <li>Automatic provider failover</li>
        <li>Latency-based routing</li>
        <li>Cost optimization routing</li>
        <li>Provider uptime monitoring</li>
        <li>Dynamic retry logic</li>
        <li>Provider performance scoring</li>
        <li>Multi-provider fallback chains</li>
      </ul>
      <p className="text-slate-600 mb-3">Example future routing logic:</p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed">
        <pre>
          {`If Paystack fails → Retry Flutterwave
If Flutterwave latency > threshold → Route to Nomba`}
        </pre>
      </div>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black">
        Support
      </h2>
      <p className="text-slate-600 mb-4">
        For integration support or partnership inquiries:
      </p>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-amber-200 mb-12 shadow-inner inline-block">
        support@synchgate.com
      </div>

      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <div></div>
        <Link
          to="/docs/installation"
          className="flex items-center justify-end gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Installation
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

export default Introduction;
