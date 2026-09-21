import { ReferenceTable } from "../../components/docs/ApiReference";
import { CodeBlock } from "../../components/docs/CodeBlock";
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

const successExample = `{
  "status": "success",
  "message": "Verification requested",
  "data": { },
  "meta": {
    "request_id": "cf0fa31c-d43a-43d3-bc3a-0d41d7bdb18b",
    "timestamp": "2026-09-18T12:46:41.387939Z"
  }
}`;

const requestError = `{
  "status": "error",
  "message": "This field may not be blank.",
  "error": {
    "code": "invalid",
    "details": {
      "account_number": ["This field may not be blank."]
    }
  },
  "meta": {
    "request_id": "6f1d2b7e-2c1a-4f0e-b7c5-1c1c1f6a9a11",
    "timestamp": "2026-09-18T12:50:03.120394Z"
  }
}`;

const processingError = `{
  "status": "error",
  "message": "Transaction reference already exists. Please use a unique reference.",
  "errors": {
    "code": "duplicate_reference"
  },
  "meta": {
    "request_id": "0b7c31c2-6f0c-4b3e-8f7e-3d5b2a9f4c20",
    "timestamp": "2026-09-18T12:51:17.774102Z"
  }
}`;

function Errors() {
  return (
    <DocPage>
      <PageHeader title="Response and Errors">
        Every SynchGate endpoint returns JSON in the same envelope, whichever
        provider handled the request. This page explains that envelope and how
        to handle failures.
      </PageHeader>

      <SectionHeading>Successful responses</SectionHeading>
      <Prose>
        Successful responses have <InlineCode>status</InlineCode> set to{" "}
        <InlineCode>"success"</InlineCode>, a human-readable{" "}
        <InlineCode>message</InlineCode>, the result in{" "}
        <InlineCode>data</InlineCode>, and a <InlineCode>meta</InlineCode>{" "}
        object.
      </Prose>
      <CodeBlock code={successExample} title="200 OK" />
      <Callout title="Quote the request ID">
        <InlineCode>meta.request_id</InlineCode> is unique to each response.
        Include it when you contact support and we can find the request.
      </Callout>

      <SectionHeading>Error responses</SectionHeading>
      <Prose>
        Failures set <InlineCode>status</InlineCode> to{" "}
        <InlineCode>"error"</InlineCode> and always include a{" "}
        <InlineCode>message</InlineCode> you can show or log. Branch your code
        on the HTTP status and on the machine-readable error{" "}
        <InlineCode>code</InlineCode>, not on the message text, which can
        change.
      </Prose>

      <SubHeading>Request errors</SubHeading>
      <p className="text-slate-600 mb-4">
        Authentication failures and invalid requests carry the code under{" "}
        <InlineCode>error.code</InlineCode>, with field-level detail in{" "}
        <InlineCode>error.details</InlineCode>.
      </p>
      <CodeBlock code={requestError} title="400 Bad Request" />

      <SubHeading>Processing errors</SubHeading>
      <p className="text-slate-600 mb-4">
        Errors raised while processing a payment or transfer carry the code
        under <InlineCode>errors.code</InlineCode>.
      </p>
      <CodeBlock code={processingError} title="400 Bad Request" />

      <Callout title="Read the code from either place">
        The two shapes differ by one key. Until they are unified, read{" "}
        <InlineCode>error.code</InlineCode> or{" "}
        <InlineCode>errors.code</InlineCode>, whichever is present.
      </Callout>

      <SectionHeading>HTTP status codes</SectionHeading>
      <ReferenceTable
        headers={["HTTP", "Meaning"]}
        rows={[
          { key: "200", cells: ["200", "The request succeeded."] },
          {
            key: "400",
            cells: [
              "400",
              "The request was invalid or the provider rejected it. Fix the request before retrying.",
            ],
          },
          {
            key: "401",
            cells: [
              "401",
              "The provider rejected the credentials stored for it in your dashboard.",
            ],
          },
          {
            key: "403",
            cells: [
              "403",
              "Your Client-Secret-Key is missing or invalid, or your account is not in live mode.",
            ],
          },
          {
            key: "402",
            cells: [
              "402",
              "Your wallet cannot cover the platform fee (0.1% of the amount) for a live transaction. Add funds to resume.",
            ],
          },
          {
            key: "502",
            cells: [
              "502",
              "The provider did not confirm the outcome. Do not assume the request failed.",
            ],
          },
          {
            key: "503",
            cells: ["503", "The provider is temporarily unavailable."],
          },
        ]}
      />

      <SectionHeading>Error codes</SectionHeading>
      <ReferenceTable
        headers={["Code", "HTTP", "Meaning"]}
        rows={[
          {
            key: "authentication_failed",
            cells: [
              "authentication_failed",
              "403 / 401",
              "403 when your API key is missing or invalid. 401 when the provider rejected your stored credentials.",
            ],
          },
          {
            key: "invalid",
            cells: [
              "invalid",
              "400",
              "A field is missing or malformed. See error.details.",
            ],
          },
          {
            key: "duplicate_reference",
            cells: [
              "duplicate_reference",
              "400",
              "The reference has already been used. References must be unique.",
            ],
          },
          {
            key: "invalid_reference",
            cells: ["invalid_reference", "400", "A reference is required."],
          },
          {
            key: "invalid_email",
            cells: [
              "invalid_email",
              "400",
              "The customer email address was rejected.",
            ],
          },
          {
            key: "invalid_amount",
            cells: ["invalid_amount", "400", "The amount was rejected."],
          },
          {
            key: "payment_failed",
            cells: [
              "payment_failed",
              "400",
              "The payment could not be initiated.",
            ],
          },
          {
            key: "transfer_failed",
            cells: [
              "transfer_failed",
              "400",
              "The transfer was rejected by the provider.",
            ],
          },
          {
            key: "insufficient_balance",
            cells: [
              "insufficient_balance",
              "400",
              "Your provider balance cannot cover the transfer.",
            ],
          },
          {
            key: "insufficient_wallet_balance",
            cells: [
              "insufficient_wallet_balance",
              "402",
              "Your wallet cannot cover the fee for this transaction, which is 0.1% of its amount. The message says how much is needed and how much is available. Add funds in the dashboard. The sandbox is unaffected.",
            ],
          },
          {
            key: "transfer_outcome_unknown",
            cells: [
              "transfer_outcome_unknown",
              "502",
              "The provider did not confirm a transfer. It may still complete. Do not retry with a new reference. Check it with Transaction Verification.",
            ],
          },
          {
            key: "provider_unavailable",
            cells: [
              "provider_unavailable",
              "503",
              "The provider is temporarily unavailable.",
            ],
          },
        ]}
      />

      <PageNav
        prev={{ label: "Authentication", to: "/docs/authentication" }}
        next={{ label: "Initiate Payment", to: "/docs/initiate-payment" }}
      />
    </DocPage>
  );
}

export default Errors;
