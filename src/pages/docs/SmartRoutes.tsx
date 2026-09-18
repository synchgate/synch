import { Link } from "react-router-dom";
import {
  Endpoint,
  ParamTable,
  ReferenceTable,
} from "../../components/docs/ApiReference";
import { CodeBlock, CodeTabs } from "../../components/docs/CodeBlock";
import {
  Callout,
  DocPage,
  InlineCode,
  PageHeader,
  PageNav,
  Prose,
  SectionHeading,
  SubHeading,
} from "../../components/docs/DocLayout";
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "POST",
  path: "/initiate-payment/smart-route/",
  body: {
    email: "customer@example.com",
    amount: 8000,
    currency: "NGN",
    reference: "order-2026-000124",
    callback_url: "https://yourdomain.com/payments/callback",
  },
});

const successResponse = `{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "cleaned_data": {
      "payment_url": "https://checkout.paystack.com/abc123xyz",
      "amount": "8000.00",
      "currency": "NGN",
      "reference": "order-2026-000124",
      "status": "success",
      "provider": "paystack"
    },
    "provider_data": {
      "data": {
        "status": true,
        "message": "Authorization URL created"
      }
    },
    "routing": {
      "provider": "paystack",
      "payment_channel": null,
      "route_type": "smart_score",
      "rule_name": null
    }
  },
  "meta": {
    "request_id": "41e97272-03b2-485c-a150-8e7c30737f3c",
    "timestamp": "2026-09-18T11:44:41.828466Z"
  }
}`;

function SmartRoutes() {
  return (
    <DocPage>
      <PageHeader eyebrow="COLLECT PAYMENTS" title="Smart Route">
        Create a payment without choosing the provider. SynchGate picks one for
        you, using the routing rules you set up or, if you have none, the
        providers' recent performance.
      </PageHeader>

      <SupportedProviders />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="POST" path="/initiate-payment/smart-route/" />
      <Prose>
        Authenticate with your secret key in the{" "}
        <InlineCode>Client-Secret-Key</InlineCode> header, as described in{" "}
        <Link
          to="/docs/authentication"
          className="text-blue-600 hover:underline"
        >
          Authentication
        </Link>
        . Everything else works like{" "}
        <Link
          to="/docs/initiate-payment"
          className="text-blue-600 hover:underline"
        >
          Initiate Payment
        </Link>
        , except that there is no <InlineCode>provider</InlineCode> field.
      </Prose>

      <SectionHeading>How the provider is chosen</SectionHeading>
      <SubHeading>1. Your routing policy</SubHeading>
      <p className="text-slate-600 mb-4">
        If you have an active Smart Route policy, its rules are checked in
        priority order and the first rule whose conditions all match decides the
        provider. A rule can test:
      </p>
      <ReferenceTable
        headers={["Condition", "Matches when"]}
        rows={[
          {
            key: "amount",
            cells: [
              "Amount range",
              "The payment amount is within the minimum and maximum you set.",
            ],
          },
          {
            key: "currency",
            cells: ["Currency", "The payment currency is one of those listed."],
          },
          {
            key: "country",
            cells: [
              "Country",
              "Your merchant profile's country is one of those listed.",
            ],
          },
          {
            key: "time",
            cells: [
              "Time of day (UTC)",
              "The request arrives inside the time window you set.",
            ],
          },
        ]}
      />
      <SubHeading>2. Performance scoring</SubHeading>
      <p className="text-slate-600 mb-8">
        With no active policy, or when no rule matches, SynchGate scores each of
        your providers on its success rate and transaction volume over the last
        hour, and uses the best. Providers with very little recent activity get
        a small boost so they can build up a track record. Sandbox and live are
        scored separately.
      </p>

      <SectionHeading>Before you begin</SectionHeading>
      <ul className="space-y-2 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>
          Both your sandbox and live environments need at least one active
          provider with credentials.
        </li>
        <li>
          Performance scoring needs at least two active providers in the
          environment you are calling.
        </li>
      </ul>
      <Callout title="No automatic failover yet">
        SynchGate does not retry on another provider if the chosen one returns
        an error. The request fails and you can send it again.
      </Callout>

      <SectionHeading>Request body</SectionHeading>
      <ParamTable
        params={[
          {
            name: "email",
            type: "string",
            required: true,
            description: "Customer's email address. Up to 100 characters.",
          },
          {
            name: "amount",
            type: "integer",
            required: true,
            description:
              "Amount in major units (naira, not kobo). Send a whole number: any decimal part is dropped. Must be greater than zero.",
          },
          {
            name: "currency",
            type: "string",
            description: "Currency code. Defaults to NGN.",
          },
          {
            name: "reference",
            type: "string",
            required: true,
            description:
              "Your unique reference for this payment, up to 50 characters.",
          },
          {
            name: "callback_url",
            type: "string",
            description:
              "URL the customer is sent back to after paying. Up to 100 characters.",
          },
        ]}
      />

      <SectionHeading>Example request</SectionHeading>
      <CodeTabs snippets={snippets} />

      <SectionHeading>Response</SectionHeading>
      <Prose>
        The response is the same as Initiate Payment, plus a{" "}
        <InlineCode>routing</InlineCode> object that tells you what was chosen.
      </Prose>
      <CodeBlock code={successResponse} title="200 OK" />

      <SubHeading>The routing object</SubHeading>
      <ReferenceTable
        headers={["Field", "Description"]}
        rows={[
          {
            key: "provider",
            cells: ["provider", "Provider that was chosen."],
          },
          {
            key: "route_type",
            cells: [
              "route_type",
              <>
                <InlineCode>smart_policy</InlineCode> when one of your rules
                matched, or <InlineCode>smart_score</InlineCode> when the
                provider was chosen by performance.
              </>,
            ],
          },
          {
            key: "rule_name",
            cells: [
              "rule_name",
              "Name of the rule that matched, or null when scoring was used.",
            ],
          },
          {
            key: "payment_channel",
            cells: [
              "payment_channel",
              "The channel set on the matching rule (for example card or bank_transfer), or null. It is returned for your information and does not restrict the provider's checkout.",
            ],
          },
        ]}
      />

      <SectionHeading>Errors</SectionHeading>
      <Prose>
        Smart Route failures return HTTP <InlineCode>400</InlineCode> with the
        reason in <InlineCode>message</InlineCode>, for example{" "}
        <InlineCode>sandbox environment has no active providers.</InlineCode>{" "}
        Authentication failures return <InlineCode>403</InlineCode>. See{" "}
        <Link to="/docs/errors" className="text-blue-600 hover:underline">
          Response and Errors
        </Link>{" "}
        for the full format.
      </Prose>

      <PageNav
        prev={{ label: "Initiate Payment", to: "/docs/initiate-payment" }}
        next={{
          label: "Transaction Verification",
          to: "/docs/transaction-verification",
        }}
      />
    </DocPage>
  );
}

export default SmartRoutes;
