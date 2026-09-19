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

const payoutResponse = `{
  "status": "success",
  "message": "Verification requested",
  "data": {
    "cleaned_data": {
      "provider": "paystack",
      "status": "success",
      "amount": "5000.00",
      "reference": "payout-2026-000041",
      "currency": "NGN",
      "transaction_type": "payout",
      "final": true,
      "message": "Transfer has been completed"
    },
    "provider_response": {
      "data": { "status": "success", "transfer_code": "TRF_x7d1kqz0f2" }
    }
  },
  "meta": {
    "request_id": "8d2f6c1e-31a4-4c19-9a55-0b0a4c1d7e02",
    "timestamp": "2026-09-19T09:14:52.387939Z"
  }
}`;

function TransactionVerification() {
  return (
    <DocPage>
      <PageHeader eyebrow="COLLECT PAYMENTS" title="Transaction Verification">
        Check the current status of a payment or a payout by its reference. Call
        it after the customer returns to your site, before you deliver value, or
        to find out how a payout ended.
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
      <Callout title="Payments and payouts">
        Send the reference of a payment or of a{" "}
        <Link to="/docs/initiate-transfer" className="underline font-medium">
          transfer
        </Link>{" "}
        and the response follows the same shape. For a payout that is still
        processing, this call asks the provider and records the answer, so it is
        also the way to settle one on demand.
      </Callout>

      <SectionHeading>Path parameters</SectionHeading>
      <ParamTable
        showRequired={false}
        params={[
          {
            name: "reference",
            type: "string",
            description:
              "The reference you sent when you initiated the payment or transfer.",
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
          {
            key: "transaction_type",
            cells: [
              "transaction_type",
              "Payouts only. Always payout. Absent for payments.",
            ],
          },
          {
            key: "final",
            cells: [
              "final",
              "Payouts only. true once the outcome is settled, false while it is still processing.",
            ],
          },
          {
            key: "message",
            cells: [
              "message",
              "Payouts only. Where the payout stands, in words.",
            ],
          },
        ]}
      />
      <p className="text-slate-600 mb-4">
        For a payout, <InlineCode>amount</InlineCode> is the amount you sent in
        naira, as a string, rather than the provider's own unit.
      </p>
      <CodeBlock code={payoutResponse} title="200 OK, a payout" />

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

      <SectionHeading>Payout status</SectionHeading>
      <ReferenceTable
        headers={["Status", "Meaning"]}
        rows={[
          {
            key: "success",
            cells: ["success", "The provider confirmed the money was sent."],
          },
          {
            key: "failed",
            cells: [
              "failed",
              "The provider confirmed it was not sent, or has no record of it. It is safe to retry with a new reference.",
            ],
          },
          {
            key: "processing",
            cells: [
              "processing",
              "Not settled yet, including when the provider could not be reached to ask. Check again shortly, and do not send it again.",
            ],
          },
        ]}
      />
      <Callout title="Only failed means safe to resend">
        A payout is marked <InlineCode>failed</InlineCode> only when the
        provider says so. A timeout or an answer we don't recognise leaves it as{" "}
        <InlineCode>processing</InlineCode>. Paying again while it is processing
        risks sending the money twice. SynchGate also re-checks open payouts
        every couple of minutes and sends a{" "}
        <Link to="/docs/webhooks" className="underline font-medium">
          webhook
        </Link>{" "}
        when one settles.
      </Callout>

      <SectionHeading>Errors</SectionHeading>
      <ReferenceTable
        headers={["HTTP", "Meaning"]}
        rows={[
          {
            key: "400",
            cells: [
              "400",
              "No payment or payout of yours has this reference, or the provider could not be reached. See message.",
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
