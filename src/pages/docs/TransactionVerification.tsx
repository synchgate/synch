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
import { FlowAnimation } from "../../components/docs/FlowAnimation";
import { verificationFlow } from "../../components/docs/flows";
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "GET",
  path: "/transaction/verify/order-2026-000123/",
});

const successResponse = `{
  "status": "success",
  "message": "Verification requested",
  "data": {
    "cleaned_data": {
      "provider": "paystack",
      "status": "success",
      "amount": 800000,
      "reference": "order-2026-000123",
      "currency": "NGN"
    },
    "provider_response": {
      "status": true,
      "message": "Verification successful",
      "data": {
        "id": 5990835342,
        "domain": "test",
        "status": "success",
        "reference": "order-2026-000123",
        "amount": 800000,
        "gateway_response": "Successful",
        "paid_at": "2026-09-18T11:50:04.000Z",
        "created_at": "2026-09-18T11:49:52.000Z",
        "channel": "card",
        "currency": "NGN"
      }
    }
  },
  "meta": {
    "request_id": "cf0fa31c-d43a-43d3-bc3a-0d41d7bdb18b",
    "timestamp": "2026-09-18T11:50:41.387939Z"
  }
}`;

function TransactionVerification() {
  return (
    <DocPage>
      <PageHeader eyebrow="COLLECT PAYMENTS" title="Transaction Verification">
        Check the current status of a payment by its reference. Call it after
        the customer returns to your site, before you deliver value.
      </PageHeader>

      <SupportedProviders />

      <SectionHeading>How it works</SectionHeading>
      <FlowAnimation {...verificationFlow} />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="GET" path="/transaction/verify/{reference}/" />
      <Prose>
        Authenticate with your secret key in the{" "}
        <InlineCode>Client-Secret-Key</InlineCode> header, as described in{" "}
        <Link
          to="/docs/authentication"
          className="text-blue-600 hover:underline"
        >
          Authentication
        </Link>
        . The environment of the key decides whether the sandbox or live payment
        is looked up.
      </Prose>
      <Callout title="Payments only">
        This endpoint verifies payments (collections). It does not return the
        status of a transfer.
      </Callout>

      <SectionHeading>Path parameters</SectionHeading>
      <ParamTable
        showRequired={false}
        params={[
          {
            name: "reference",
            type: "string",
            description:
              "The reference you sent when you initiated the payment.",
          },
        ]}
      />

      <SectionHeading>Example request</SectionHeading>
      <CodeTabs snippets={snippets} />

      <SectionHeading>Response</SectionHeading>
      <CodeBlock code={successResponse} title="200 OK" />

      <SubHeading>Response fields</SubHeading>
      <p className="text-slate-600 mb-4">
        <InlineCode>data.cleaned_data</InlineCode> is normalised across
        providers. <InlineCode>data.provider_response</InlineCode> is the
        provider's own answer, included for debugging.
      </p>
      <ReferenceTable
        headers={["Field", "Description"]}
        rows={[
          {
            key: "provider",
            cells: ["provider", "Provider that processed the payment."],
          },
          {
            key: "status",
            cells: [
              "status",
              "Payment status. success means the payment was completed. See below.",
            ],
          },
          {
            key: "amount",
            cells: [
              "amount",
              "Amount as the provider reports it. Paystack reports the smallest currency unit (kobo), so 800000 above is 8,000.00 naira.",
            ],
          },
          {
            key: "reference",
            cells: ["reference", "Reference of the payment."],
          },
          {
            key: "currency",
            cells: ["currency", "Currency of the payment."],
          },
        ]}
      />

      <SectionHeading>Payment status</SectionHeading>
      <ReferenceTable
        headers={["Status", "Meaning"]}
        rows={[
          {
            key: "success",
            cells: ["success", "The payment was completed."],
          },
          {
            key: "failed",
            cells: ["failed", "The payment was declined or failed."],
          },
          {
            key: "abandoned",
            cells: ["abandoned", "The customer left the checkout page."],
          },
          {
            key: "pending",
            cells: [
              "pending / processing",
              "The customer or the provider has not finished yet. Check again shortly.",
            ],
          },
        ]}
      />

      <SectionHeading>Errors</SectionHeading>
      <ReferenceTable
        headers={["HTTP", "Meaning"]}
        rows={[
          {
            key: "400",
            cells: [
              "400",
              "No payment was found for the reference, or the provider could not be reached. See message.",
            ],
          },
          {
            key: "403",
            cells: [
              "403",
              "Your Client-Secret-Key is missing or invalid (authentication_failed).",
            ],
          },
        ]}
      />

      <PageNav
        prev={{ label: "Smart Route", to: "/docs/smart-routes" }}
        next={{ label: "Banks API", to: "/docs/banks" }}
      />
    </DocPage>
  );
}

export default TransactionVerification;
