import {
  Callout,
  DocPage,
  PageHeader,
  PageNav,
  SectionHeading,
} from "../../components/docs/DocLayout";

const dataGroups = [
  {
    title: "Merchant data",
    items: [
      "Business information",
      "Account contact details",
      "API usage data",
      "Payment provider credentials you connect",
    ],
  },
  {
    title: "Transaction data",
    items: [
      "Transaction reference and amount",
      "Payment provider used",
      "Timestamps and status",
    ],
  },
  {
    title: "Customer and recipient data",
    items: [
      "Customer email address",
      "Payout recipient name, account number and bank",
      "Merchant-provided metadata",
    ],
  },
];

const purposes = [
  "Processing payment transactions and transfers",
  "Routing requests to payment providers",
  "Generating transaction analytics",
  "Maintaining system reliability and monitoring",
  "Detecting suspicious or abusive activity",
];

const safeguards = [
  "encrypted data transmission using HTTPS",
  "provider credentials stored encrypted",
  "restricted internal access to systems",
  "system monitoring and logging",
];

const rights = [
  "Access to personal data",
  "Correction of inaccuracies",
  "Request for deletion",
];

function DataPrivacy() {
  return (
    <DocPage>
      <PageHeader title="Data Privacy">
        SynchGate respects the privacy of the users and businesses that interact
        with our platform. This page describes how we collect, use and protect
        data when our services are used.
      </PageHeader>

      <SectionHeading>Data we collect</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        When merchants integrate with SynchGate, certain information is
        processed to facilitate payments, transfers and platform functionality.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dataGroups.map((group) => (
          <div
            key={group.title}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {group.title}
            </h4>
            <ul className="text-slate-600 space-y-2 text-sm">
              {group.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Callout variant="warning" title="No raw card details">
        SynchGate does not store raw card details.
      </Callout>

      <SectionHeading>How data is used</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        The data processed by SynchGate is used strictly for platform operations
        and service delivery. Primary purposes include:
      </p>
      <ul className="space-y-4 mb-6">
        {purposes.map((purpose) => (
          <li key={purpose} className="flex items-center gap-3 text-slate-700">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            {purpose}
          </li>
        ))}
      </ul>
      <p className="font-semibold text-slate-900 mb-8">
        We do not sell customer or merchant data.
      </p>

      <SectionHeading>Data storage and security</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        We take reasonable technical and organisational measures to protect data
        processed by the platform:
      </p>
      <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-slate-300">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm leading-relaxed">
          {safeguards.map((safeguard) => (
            <li key={safeguard}>&gt; {safeguard}</li>
          ))}
        </ul>
      </div>

      <SectionHeading>User rights</SectionHeading>
      <p className="text-slate-600 leading-relaxed mb-6">
        Individuals whose data is processed may have rights under applicable
        data protection laws, including:
      </p>
      <div className="flex flex-wrap gap-4 mb-8">
        {rights.map((right) => (
          <span
            key={right}
            className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200"
          >
            {right}
          </span>
        ))}
      </div>

      <SectionHeading>Contact us</SectionHeading>
      <p className="text-slate-600 mb-2">
        For questions about privacy or data protection, email{" "}
        <a
          href="mailto:support@synchgate.com"
          className="text-blue-600 hover:underline"
        >
          support@synchgate.com
        </a>
        .
      </p>

      <PageNav prev={{ label: "PCI Compliance", to: "/docs/pci-compliance" }} />
    </DocPage>
  );
}

export default DataPrivacy;
