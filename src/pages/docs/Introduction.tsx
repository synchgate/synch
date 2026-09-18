import { FileJson, Layers, Settings, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ReferenceTable } from "../../components/docs/ApiReference";
import { CodeBlock } from "../../components/docs/CodeBlock";
import {
  DocPage,
  InlineCode,
  PageHeader,
  PageNav,
  SectionHeading,
  SubHeading,
} from "../../components/docs/DocLayout";

const components = [
  {
    title: "API Gateway",
    Icon: ShieldCheck,
    color: "text-blue-500",
    description:
      "Handles every merchant request: authentication, request validation and routing.",
  },
  {
    title: "Provider Adapter Layer",
    Icon: Layers,
    color: "text-indigo-500",
    description:
      "One adapter per payment provider, responsible for request transformation, API communication and response normalisation.",
  },
  {
    title: "Transaction Engine",
    Icon: Settings,
    color: "text-emerald-500",
    description:
      "Records transaction metadata, tracks payment state and stores the provider's response.",
  },
  {
    title: "Response Normaliser",
    Icon: FileJson,
    color: "text-amber-500",
    description:
      "Converts every provider response into one standard format before it reaches you.",
  },
];

function Introduction() {
  return (
    <DocPage>
      <PageHeader eyebrow="SynchGate v2.0 Docs" title="Overview">
        SynchGate is a payment infrastructure API. Integrate once and collect
        payments, send bank transfers and look up accounts across providers such
        as Paystack, Flutterwave and Nomba, with one consistent request and
        response format.
      </PageHeader>

      <p className="text-slate-600 leading-relaxed mb-6">
        Instead of building and maintaining a separate integration for each
        provider, you send requests to SynchGate. It authenticates you, routes
        the request to the right provider with your own provider credentials,
        records the transaction and returns a normalised response.
      </p>

      <SectionHeading>What you can do</SectionHeading>
      <ReferenceTable
        headers={["Capability", "Description"]}
        rows={[
          {
            key: "collect",
            cells: [
              <Link
                key="collect"
                to="/docs/initiate-payment"
                className="text-amber-300 hover:underline"
              >
                Collect payments
              </Link>,
              "Create a hosted checkout on the provider you choose and verify the result by reference.",
            ],
          },
          {
            key: "smart",
            cells: [
              <Link
                key="smart"
                to="/docs/smart-routes"
                className="text-amber-300 hover:underline"
              >
                Smart Route
              </Link>,
              "Let SynchGate choose the provider, using your routing rules or the providers' recent performance.",
            ],
          },
          {
            key: "transfer",
            cells: [
              <Link
                key="transfer"
                to="/docs/initiate-transfer"
                className="text-amber-300 hover:underline"
              >
                Bank transfers
              </Link>,
              "Pay out to any supported bank account, after listing banks and resolving the account name.",
            ],
          },
          {
            key: "envs",
            cells: [
              "Sandbox and live",
              "A separate key and environment for testing, so you can build without moving real money.",
            ],
          },
        ]}
      />

      <SectionHeading>How it works</SectionHeading>
      <p className="text-slate-600 mb-4">
        Without SynchGate, you integrate each provider separately, and each one
        has its own API, authentication, response format and failure behaviour.
      </p>
      <CodeBlock
        code={`Merchant → Paystack
Merchant → Flutterwave
Merchant → Nomba`}
        className="mb-6"
      />
      <p className="text-slate-600 mb-4">
        With SynchGate there is one integration layer:
      </p>
      <CodeBlock
        code={`Client application
    │
    ▼
SynchGate API
    ├── Paystack
    ├── Flutterwave
    └── Nomba`}
      />

      <SubHeading>Core components</SubHeading>
      <div className="space-y-6 mb-12">
        {components.map(({ title, Icon, color, description }) => (
          <div key={title}>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${color}`} /> {title}
            </h4>
            <p className="text-slate-600">{description}</p>
          </div>
        ))}
      </div>

      <SectionHeading>Why SynchGate</SectionHeading>
      <p className="text-slate-600 mb-4">
        Relying on a single provider creates a single point of failure.
        SynchGate lets you run several providers behind one API.
      </p>
      <ul className="space-y-1 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>Faster integration: one API instead of many</li>
        <li>
          Better reliability: switch or split providers without code changes
        </li>
        <li>Less maintenance for your engineering team</li>
        <li>A consistent developer experience</li>
      </ul>

      <SectionHeading>Use cases</SectionHeading>
      <ReferenceTable
        headers={["Team", "How SynchGate helps"]}
        rows={[
          {
            key: "startups",
            cells: [
              "Startups",
              "Avoid building multiple provider integrations.",
            ],
          },
          {
            key: "marketplaces",
            cells: [
              "Marketplaces",
              "Collect from buyers and pay out to sellers through one API.",
            ],
          },
          {
            key: "volume",
            cells: [
              "High-volume businesses",
              "Route payments to the provider that is performing best.",
            ],
          },
          {
            key: "fintech",
            cells: [
              "Fintech companies",
              "Build payment orchestration quickly.",
            ],
          },
        ]}
      />

      <SectionHeading>Roadmap</SectionHeading>
      <p className="text-slate-600 mb-4">
        Explicit provider routing, Smart Route, bank transfers and account
        resolution are available today. These are planned:
      </p>
      <ul className="space-y-1 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>
          Automatic failover to another provider when one returns an error
        </li>
        <li>Latency-based and cost-based routing</li>
        <li>Provider uptime monitoring</li>
        <li>Dynamic retry logic</li>
      </ul>

      <SectionHeading>Support</SectionHeading>
      <p className="text-slate-600 mb-4">
        For integration support or partnership enquiries, email{" "}
        <a
          href="mailto:support@synchgate.com"
          className="text-blue-600 hover:underline"
        >
          support@synchgate.com
        </a>
        . When you write about a request, include its{" "}
        <InlineCode>meta.request_id</InlineCode>.
      </p>

      <PageNav next={{ label: "Installation", to: "/docs/installation" }} />
    </DocPage>
  );
}

export default Introduction;
