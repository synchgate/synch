import { ArrowRight } from "lucide-react";
import {
  Callout,
  DocPage,
  PageHeader,
  PageNav,
  SectionHeading,
} from "../../components/docs/DocLayout";

const requirements = [
  "Secure network architecture",
  "Access control",
  "Encryption of sensitive data",
  "Vulnerability management",
  "Monitoring and logging",
  "Regular security testing",
];

const benefits = [
  "Card data does not pass through merchant servers",
  "Card details are not stored within SynchGate systems",
  "Payment providers handle PCI-sensitive processing",
];

const controls = [
  "HTTPS encryption for all API requests",
  "Secret-key authentication on every API request",
  "Provider credentials stored encrypted",
  "Restricted internal access to infrastructure",
  "Monitoring and logging of API activity",
];

const roadmap = [
  "Formal PCI DSS assessment",
  "Enhanced security auditing",
  "Infrastructure penetration testing",
  "Expanded compliance programs",
];

function PCICompliance() {
  return (
    <DocPage>
      <PageHeader title="PCI Compliance">
        The Payment Card Industry Data Security Standard (PCI DSS) is a global
        security standard created to protect cardholder data and reduce payment
        fraud. Any system that processes, stores or transmits cardholder data
        must follow the requirements set by the PCI Security Standards Council.
      </PageHeader>

      <SectionHeading>Security requirements</SectionHeading>
      <p className="text-slate-600 mb-4">
        These requirements include controls around:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {requirements.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {item}
          </li>
        ))}
      </ul>

      <SectionHeading>Our approach</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        SynchGate is built to minimise exposure to sensitive cardholder data. In
        most payment flows, card information is collected directly by the
        payment provider on its secure hosted payment page.
      </p>
      <div className="bg-slate-50 rounded-2xl p-8 mb-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-xl mb-4 text-slate-900">
          Benefits of this architecture
        </h3>
        <ul className="space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-slate-500 mb-8">
        This approach reduces compliance complexity for businesses integrating
        with the platform.
      </p>

      <SectionHeading>Secure provider integrations</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        SynchGate integrates with established payment providers that maintain
        their own PCI DSS compliant infrastructure. Supported providers include{" "}
        <strong>Paystack</strong>, <strong>Flutterwave</strong> and{" "}
        <strong>Nomba</strong>.
      </p>

      <SectionHeading>Security controls</SectionHeading>
      <ul className="space-y-3 mb-8">
        {controls.map((control) => (
          <li
            key={control}
            className="flex items-center gap-3 text-slate-600 py-2 border-b border-slate-100 last:border-0"
          >
            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{control}</span>
          </li>
        ))}
      </ul>

      <SectionHeading>Future compliance roadmap</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        As SynchGate grows, we plan to strengthen our compliance posture
        through:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {roadmap.map((item) => (
          <div
            key={item}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-medium text-slate-800"
          >
            {item}
          </div>
        ))}
      </div>

      <Callout title="Shared responsibility">
        Security in payment systems is shared between the merchant, the payment
        provider and SynchGate. Merchants integrating with our API should make
        sure their own systems follow best practices for protecting customer
        data, including keeping secret keys on the server.
      </Callout>

      <PageNav
        prev={{ label: "Webhooks", to: "/docs/webhooks" }}
        next={{ label: "Data Privacy", to: "/docs/data-privacy" }}
      />
    </DocPage>
  );
}

export default PCICompliance;
