import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function PCICompliance() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        PCI Compliance
      </h1>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl mb-10 flex gap-4 text-blue-800 shadow-sm">
        <ShieldCheck className="w-8 h-8 shrink-0 text-blue-600" />
        <div>
          <h4 className="font-semibold text-lg mb-1 text-blue-900">
            PCI-DSS Overview
          </h4>
          <p className="text-blue-800/80 leading-relaxed">
            The Payment Card Industry Data Security Standard (PCI DSS) is a
            global security standard created to protect cardholder data and
            reduce payment fraud.
          </p>
        </div>
      </div>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Any system that processes, stores, or transmits cardholder data must
        follow strict security requirements defined by the PCI Security
        Standards Council.
      </p>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Security Requirements
      </h2>
      <p className="text-slate-600 mb-4 text-lg">
        These requirements include controls around:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        {[
          "Secure network architecture",
          "Access control",
          "Encryption of sensitive data",
          "Vulnerability management",
          "Monitoring and logging",
          "Regular security testing",
        ].map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Our Approach to PCI Compliance
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        SynchGate is built to minimize exposure to sensitive cardholder data. In
        most payment flows, card information is collected directly by the
        payment provider through their secure hosted payment pages.
      </p>

      <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-xl mb-4 text-slate-900">
          Benefits of this Architecture:
        </h3>
        <ul className="space-y-4">
          {[
            "Card data does not pass through merchant servers",
            "Card details are not stored within SynchGate systems",
            "Payment providers handle PCI-sensitive processing",
          ].map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <span className="text-lg">{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-slate-500 italic">
          This approach reduces compliance complexity for businesses integrating
          with the platform.
        </p>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Secure Provider Integrations
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        SynchGate integrates with established payment providers that maintain
        their own PCI DSS compliant infrastructure. Supported providers include
        **Paystack**, **Flutterwave**, and **Stripe**.
      </p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Security Controls
      </h2>
      <ul className="space-y-3 mb-12">
        {[
          "HTTPS encryption for all API requests",
          "Secure API authentication mechanisms",
          "Restricted internal access to infrastructure",
          "Monitoring and logging of API activity",
          "Rate limiting and abuse protection",
        ].map((control, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-slate-600 py-2 border-b border-slate-100 last:border-0"
          >
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span className="text-lg">{control}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Future Compliance Roadmap
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        As SynchGate grows, we plan to strengthen our compliance posture
        through:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {[
          "Formal PCI DSS assessment",
          "Enhanced security auditing",
          "Infrastructure penetration testing",
          "Expanded compliance programs",
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-medium text-slate-800"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white mb-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <h2 className="font-['Outfit'] text-3xl font-bold mb-6 relative z-10">
          Shared Responsibility
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-6 relative z-10">
          Security in payment systems is a shared responsibility between the
          merchant, the payment provider, and SynchGate.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed relative z-10">
          Merchants integrating with our API should ensure their own systems
          follow best practices for protecting customer data.
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/initiate-payment"
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
              Initiate Payment
            </span>
          </div>
        </Link>
        <Link
          to="/docs/data-privacy"
          className="flex items-center justify-end gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Data Privacy
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

export default PCICompliance;
