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
import { transferFlow } from "../../components/docs/flows";
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "POST",
  path: "/initiate-transfer/",
  body: {
    provider: "paystack",
    amount: 5000,
    currency: "NGN",
    account_number: "0123456789",
    account_name: "Ada Obi",
    bank_code: "058",
    bank_name: "GTBank",
    reference: "payout-2026-000001",
    narration: "September salary",
  },
});

const successResponse = `{
  "status": "success",
  "message": "Transfer initiated successfully",
  "data": {
    "cleaned_data": {
      "reference": "payout-2026-000001",
      "provider_reference": "TRF_1ptvuv321ahaa7q",
      "amount": "5000.00",
      "currency": "NGN",
      "fee": null,
      "status": "processing",
      "provider_status": "pending",
      "message": "Transfer has been queued",
      "provider": "paystack",
      "transaction_id": "TXN-3F9A1C7D2B04"
    },
    "provider_data": {
      "data": {
        "status": true,
        "message": "Transfer has been queued"
      }
    }
  },
  "meta": {
    "request_id": "41e97272-03b2-485c-a150-8e7c30737f3c",
    "timestamp": "2026-09-18T11:44:41.828466Z"
  }
}`;

const errorResponse = `{
  "status": "error",
  "message": "Insufficient balance on your payment provider account to complete this transfer.",
  "errors": {
    "code": "insufficient_balance"
  },
  "meta": {
    "request_id": "9a3c1c66-72e5-4c0e-9c0e-8f1b7a8d6f10",
    "timestamp": "2026-09-18T11:45:02.113942Z"
  }
}`;

function InitiateTransfer() {
  return (
    <DocPage>
      <PageHeader eyebrow="TRANSFER" title="Initiate Transfer">
        Send money from your payment provider balance to a bank account with a
        single request. SynchGate routes the payout to the provider you name and
        returns the same response shape whichever one you choose.
      </PageHeader>

      <Callout variant="warning" title="Live keys move real money">
        A request made with a live key (<InlineCode>synch_sk_live_…</InlineCode>
        ) pays out from your provider balance and cannot be recalled. Build and
        test with a sandbox key (<InlineCode>synch_sk_sandbox_…</InlineCode>)
        first. Sandbox transfers use the test credentials you configured for the
        provider and are recorded separately from live ones.
      </Callout>

      <SupportedProviders />

      <SectionHeading>How it works</SectionHeading>
      <FlowAnimation {...transferFlow} />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="POST" path="/initiate-transfer/" />

      <Prose>
        Authenticate with your secret key in the{" "}
        <InlineCode>Client-Secret-Key</InlineCode> header, as described in{" "}
        <Link
          to="/docs/authentication"
          className="text-blue-600 hover:underline"
        >
          Authentication
        </Link>
        .
      </Prose>

      <SectionHeading>Before you begin</SectionHeading>
      <ol className="list-decimal list-inside space-y-2 mb-8 text-slate-600 ml-2">
        <li>
          Configure the provider in your dashboard and make sure its balance can
          cover the transfer.
        </li>
        <li>
          Look up the recipient's bank code with the{" "}
          <Link to="/docs/banks" className="text-blue-600 hover:underline">
            Banks API
          </Link>
          .
        </li>
        <li>
          Confirm the account name with{" "}
          <Link
            to="/docs/resolve-account"
            className="text-blue-600 hover:underline"
          >
            Resolve Account
          </Link>{" "}
          so you never pay out to the wrong person.
        </li>
      </ol>

      <SectionHeading>Request body</SectionHeading>
      <ParamTable
        params={[
          {
            name: "provider",
            type: "string",
            required: true,
            description:
              "Provider that should execute the transfer, for example paystack, flutterwave or nomba.",
          },
          {
            name: "amount",
            type: "decimal",
            required: true,
            description:
              "Amount in major units (naira, not kobo), up to 2 decimal places. Must be greater than zero.",
          },
          {
            name: "currency",
            type: "string",
            description: "Currency code. Defaults to NGN.",
          },
          {
            name: "account_number",
            type: "string",
            required: true,
            description:
              "Recipient's bank account number. Up to 20 characters.",
          },
          {
            name: "account_name",
            type: "string",
            required: true,
            description:
              "Recipient's account name, as returned by Resolve Account.",
          },
          {
            name: "bank_code",
            type: "string",
            required: true,
            description:
              "Recipient bank's code for the chosen provider, from the Banks API. Up to 20 characters.",
          },
          {
            name: "bank_name",
            type: "string",
            description:
              "Recipient's bank name. Stored with the transfer for your records.",
          },
          {
            name: "reference",
            type: "string",
            required: true,
            description: (
              <>
                Your unique reference for this transfer, up to 50 characters.
                See{" "}
                <a href="#references" className="text-blue-300 underline">
                  References and retries
                </a>
                .
              </>
            ),
          },
          {
            name: "narration",
            type: "string",
            description:
              "Description shown on the recipient's statement, where the provider supports it. Up to 255 characters.",
          },
        ]}
      />

      <SectionHeading>Example request</SectionHeading>
      <CodeTabs snippets={snippets} />

      <SectionHeading>Response</SectionHeading>
      <Prose>
        A successful call returns <InlineCode>200</InlineCode> once the provider
        has accepted the transfer. That is not the same as the money having
        arrived: check <InlineCode>cleaned_data.status</InlineCode>.
      </Prose>
      <CodeBlock code={successResponse} title="200 OK" />

      <SubHeading>Response fields</SubHeading>
      <p className="text-slate-600 mb-4">
        Everything under <InlineCode>data.cleaned_data</InlineCode> has the same
        shape for every provider. <InlineCode>data.provider_data</InlineCode> is
        the provider's raw response, included for debugging. Do not build logic
        on it, because it differs between providers.
      </p>
      <ReferenceTable
        headers={["Field", "Description"]}
        rows={[
          {
            key: "reference",
            cells: ["reference", "The reference you sent."],
          },
          {
            key: "transaction_id",
            cells: [
              "transaction_id",
              "SynchGate's identifier for this payout. Quote it when contacting support.",
            ],
          },
          {
            key: "provider_reference",
            cells: [
              "provider_reference",
              "The provider's own identifier for the transfer, where they issue one.",
            ],
          },
          {
            key: "amount",
            cells: ["amount", "Amount transferred, as a string."],
          },
          {
            key: "currency",
            cells: ["currency", "Currency of the transfer."],
          },
          {
            key: "fee",
            cells: [
              "fee",
              "Fee reported by the provider, or null if the provider does not report one at this stage.",
            ],
          },
          {
            key: "status",
            cells: [
              "status",
              <>
                Normalised status: <InlineCode>processing</InlineCode> or{" "}
                <InlineCode>success</InlineCode>. See below.
              </>,
            ],
          },
          {
            key: "provider_status",
            cells: [
              "provider_status",
              "The provider's own status word, for example pending.",
            ],
          },
          {
            key: "message",
            cells: ["message", "Message from the provider."],
          },
          {
            key: "provider",
            cells: ["provider", "Provider that handled the transfer."],
          },
        ]}
      />

      <SectionHeading>Transfer status</SectionHeading>
      <ReferenceTable
        headers={["Status", "Meaning"]}
        rows={[
          {
            key: "processing",
            cells: [
              "processing",
              "The provider accepted the transfer and is still completing it. Most bank transfers start here.",
            ],
          },
          {
            key: "success",
            cells: [
              "success",
              "The provider confirmed the transfer straight away.",
            ],
          },
          {
            key: "failed",
            cells: [
              "failed",
              "The provider rejected the transfer. This is returned as an error response, not as a 200.",
            ],
          },
        ]}
      />

      <Callout title="Checking a transfer's final status">
        A transfer that comes back <InlineCode>processing</InlineCode> is
        settled later. SynchGate re-checks it with the provider every couple of
        minutes and calls your{" "}
        <Link to="/docs/webhooks" className="underline font-medium">
          webhook
        </Link>{" "}
        with <InlineCode>payout.completed</InlineCode> or{" "}
        <InlineCode>payout.failed</InlineCode>. You can also ask at any time
        with{" "}
        <Link
          to="/docs/transaction-verification"
          className="underline font-medium"
        >
          Transaction Verification
        </Link>
        , using the same reference. Don't send it again until it shows{" "}
        <InlineCode>failed</InlineCode>.
      </Callout>

      <SectionHeading id="references">References and retries</SectionHeading>
      <Prose>
        The <InlineCode>reference</InlineCode> identifies a transfer and
        protects you from paying twice.
      </Prose>
      <ul className="space-y-2 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>
          Each reference can be used <strong>once</strong> per account across
          sandbox and live, including after a failed attempt. Send a new
          reference to try a rejected transfer again.
        </li>
        <li>
          If you send a reference you have already used, the request is rejected
          with <InlineCode>duplicate_reference</InlineCode> and nothing is sent
          to the provider.
        </li>
        <li>
          If a request times out or returns{" "}
          <InlineCode>transfer_outcome_unknown</InlineCode> (HTTP 502), the
          transfer may still complete.{" "}
          <strong>Do not retry with a new reference.</strong> Retrying with the
          same one is safe: you will get{" "}
          <InlineCode>duplicate_reference</InlineCode>, which confirms SynchGate
          already has it.
        </li>
      </ul>

      <SectionHeading>Errors</SectionHeading>
      <CodeBlock code={errorResponse} title="400 Bad Request" />
      <ReferenceTable
        headers={["HTTP", "Code", "Meaning and what to do"]}
        rows={[
          {
            key: "invalid",
            cells: [
              "400",
              "invalid",
              <>
                A field is missing or malformed. The offending fields are listed
                in <InlineCode>error.details</InlineCode>.
              </>,
            ],
          },
          {
            key: "duplicate_reference",
            cells: [
              "400",
              "duplicate_reference",
              "This reference was already used. Use a new one for a new transfer.",
            ],
          },
          {
            key: "insufficient_balance",
            cells: [
              "400",
              "insufficient_balance",
              "The balance on your provider account cannot cover the transfer. Top it up and retry with a new reference.",
            ],
          },
          {
            key: "transfer_failed",
            cells: [
              "400",
              "transfer_failed",
              "The provider rejected the transfer, for example because the account details are invalid. The message says why when the provider gives a reason.",
            ],
          },
          {
            key: "authentication_failed",
            cells: [
              "401",
              "authentication_failed",
              "The provider rejected the credentials stored for it. Update them in your dashboard.",
            ],
          },
          {
            key: "403",
            cells: [
              "403",
              "authentication_failed",
              "Your Client-Secret-Key is missing or invalid.",
            ],
          },
          {
            key: "wallet",
            cells: [
              "402",
              "insufficient_wallet_balance",
              "Your wallet cannot cover the fee for a live transfer. Add funds in the dashboard. Sandbox needs no wallet.",
            ],
          },
          {
            key: "unknown",
            cells: [
              "502",
              "transfer_outcome_unknown",
              "The provider did not confirm the outcome. The transfer may still complete. See References and retries.",
            ],
          },
          {
            key: "unavailable",
            cells: [
              "503",
              "provider_unavailable",
              "The provider is temporarily unavailable.",
            ],
          },
        ]}
      />
      <p className="text-slate-600 mb-8">
        See{" "}
        <Link to="/docs/errors" className="text-blue-600 hover:underline">
          Response and Errors
        </Link>{" "}
        for the full error format.
      </p>

      <SectionHeading>Provider notes</SectionHeading>
      <ReferenceTable
        headers={["Provider", "Notes"]}
        rows={[
          {
            key: "paystack",
            cells: [
              "paystack",
              "Paystack requires references of 16 to 50 characters using lowercase letters, numbers, hyphens and underscores. If your Paystack account asks for an OTP to confirm transfers, the transfer stays processing until it is confirmed there. Turn that setting off to send transfers from the API.",
            ],
          },
          {
            key: "flutterwave",
            cells: [
              "flutterwave",
              "bank_code must be a Flutterwave bank code. Transfers are queued and normally start as processing.",
            ],
          },
          {
            key: "nomba",
            cells: [
              "nomba",
              "Your business name is sent as the sender name. Amounts keep their kobo (for example 1500.50).",
            ],
          },
        ]}
      />

      <PageNav
        prev={{ label: "Resolve Account", to: "/docs/resolve-account" }}
        next={{ label: "Webhooks", to: "/docs/webhooks" }}
      />
    </DocPage>
  );
}

export default InitiateTransfer;
