import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";

function DataPrivacy() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Data Privacy
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        SynchGate respects the privacy of users and businesses that interact
        with our platform. This page describes how we collect, use, and protect
        data when our services are used.
      </p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Data We Collect
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        When merchants integrate with SynchGate, certain information is
        processed in order to facilitate payment transactions and platform
        functionality.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Merchant Data
          </h4>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li>• Business information</li>
            <li>• API usage data</li>
            <li>• Account contact details</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Transaction Data
          </h4>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li>• Transaction reference</li>
            <li>• Transaction amount</li>
            <li>• Payment provider used</li>
            <li>• Timestamps & Status</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Customer Data
          </h4>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li>• Email address</li>
            <li>• Payment reference</li>
            <li>• Merchant-provided metadata</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-12 flex gap-4 text-amber-800 shadow-sm">
        <Lock className="w-6 h-6 shrink-0 mt-0.5" />
        <p className="font-medium">
          SynchGate does not store raw card details.
        </p>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        How Data Is Used
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        The data processed by SynchGate is used strictly for platform operations
        and service delivery. Primary purposes include:
      </p>
      <ul className="space-y-4 mb-12">
        {[
          "Processing payment transactions",
          "Routing requests to payment providers",
          "Generating transaction analytics",
          "Maintaining system reliability and monitoring",
          "Detecting suspicious or abusive activity",
        ].map((purpose) => (
          <li
            key={purpose}
            className="flex items-center gap-3 text-slate-700 text-lg"
          >
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            {purpose}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-slate-900 text-xl mb-4">
        We do not sell customer or merchant data.
      </h3>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Data Storage and Security
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        We take reasonable technical and organizational measures to protect data
        processed by the platform:
      </p>
      <div className="bg-slate-900 rounded-2xl p-8 mb-12 text-slate-300">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm leading-relaxed">
          <li>&gt; encrypted data transmission using HTTPS</li>
          <li>&gt; secure infrastructure hosting</li>
          <li>&gt; restricted internal access to systems</li>
          <li>&gt; system monitoring and logging</li>
        </ul>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        User Rights
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        Individuals whose data is processed may have rights under applicable
        data protection laws, including:
      </p>
      <div className="flex flex-wrap gap-4 mb-16">
        {[
          "Access to personal data",
          "Correction of inaccuracies",
          "Request for deletion",
        ].map((right) => (
          <span
            key={right}
            className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200"
          >
            {right}
          </span>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 mb-16 text-center">
        <h3 className="font-['Outfit'] text-2xl font-bold mb-4 text-black text-center">
          Contact Us
        </h3>
        <p className="text-slate-600 text-lg mb-6">
          For questions regarding privacy or data protection:
        </p>
        <a
          href="mailto:support@synchgate.com"
          className="text-blue-600 text-2xl font-bold hover:underline"
        >
          support@synchgate.com
        </a>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/pci-compliance"
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
              PCI Compliance
            </span>
          </div>
        </Link>
        <div className="min-w-0" />
      </div>
    </div>
  );
}

export default DataPrivacy;
