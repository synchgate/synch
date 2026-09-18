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
  path: "/initiate-payment/",
  body: {
    provider: "paystack",
    email: "customer@example.com",
    amount: 8000,
    currency: "NGN",
    reference: "order-2026-000123",
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
      "reference": "order-2026-000123",
      "status": "success",
      "provider": "paystack"
    },
    "provider_data": {
      "data": {
        "status": true,
        "message": "Authorization URL created",
        "data": {
          "authorization_url": "https://checkout.paystack.com/abc123xyz",
          "access_code": "abc123xyz",
          "reference": "order-2026-000123"
        }
      }
    }
  },
  "meta": {
    "request_id": "41e97272-03b2-485c-a150-8e7c30737f3c",
    "timestamp": "2026-09-18T11:44:41.828466Z"
  }
}`;

function InitiatePayment() {
  return (
    <DocPage>
      <PageHeader eyebrow="COLLECT PAYMENTS" title="Initiate Payment">
        Create a payment and get back a hosted checkout link for your customer.
        You name the provider that should process it, and SynchGate returns the
        same response shape whichever one you choose.
      </PageHeader>

      <SupportedProviders />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="POST" path="/initiate-payment/" />
      <Prose>
        Authenticate with your secret key in the{" "}
        <InlineCode>Client-Secret-Key</InlineCode> header, as described in{" "}
        <Link
          to="/docs/authentication"
          className="text-blue-600 hover:underline"
        >
          Authentication
        </Link>
        . The provider must already be connected in your dashboard.
      </Prose>
      <Callout title="Want SynchGate to choose the provider?">
        Use{" "}
        <Link to="/docs/smart-routes" className="underline font-medium">
          Smart Route
        </Link>{" "}
        and leave the provider out of the request.
      </Callout>

      <SectionHeading>Request body</SectionHeading>
      <ParamTable
        params={[
          {
            name: "provider",
            type: "string",
            required: true,
            description:
              "Provider that should process the payment, for example paystack, flutterwave or nomba.",
          },
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
            description: (
              <>
                Your unique reference for this payment, up to 50 characters. See{" "}
                <a href="#references" className="text-blue-300 underline">
                  References
                </a>
                .
              </>
            ),
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
            key: "payment_url",
            cells: [
              "payment_url",
              "The provider's hosted checkout page. Redirect your customer here.",
            ],
          },
          {
            key: "amount",
            cells: ["amount", "Amount of the payment, as a string."],
          },
          {
            key: "currency",
            cells: ["currency", "Currency of the payment."],
          },
          {
            key: "reference",
            cells: [
              "reference",
              "The reference for this payment. Use it to verify the payment.",
            ],
          },
          {
            key: "status",
            cells: [
              "status",
              "Whether the provider created the checkout. This is not the payment status. The customer has not paid yet.",
            ],
          },
          {
            key: "provider",
            cells: ["provider", "Provider that handled the request."],
          },
        ]}
      />

      <SectionHeading>After the customer pays</SectionHeading>
      <ol className="list-decimal list-inside space-y-2 mb-8 text-slate-600 ml-2">
        <li>
          Redirect the customer to <InlineCode>payment_url</InlineCode>.
        </li>
        <li>
          After paying, the provider sends the customer to your{" "}
          <InlineCode>callback_url</InlineCode>.
        </li>
        <li>
          Confirm the outcome with{" "}
          <Link
            to="/docs/transaction-verification"
            className="text-blue-600 hover:underline"
          >
            Transaction Verification
          </Link>{" "}
          before you deliver value. Never rely on the redirect alone.
        </li>
      </ol>

      <SectionHeading>Payment status</SectionHeading>
      <ReferenceTable
        headers={["Status", "Meaning"]}
        rows={[
          {
            key: "pending",
            cells: ["pending", "The payment is waiting for the customer."],
          },
          {
            key: "processing",
            cells: [
              "processing",
              "The provider is still working on the payment.",
            ],
          },
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
        ]}
      />

      <SectionHeading id="references">References</SectionHeading>
      <Prose>
        Each <InlineCode>reference</InlineCode> can be used once per account,
        across sandbox and live. Reusing one is rejected with{" "}
        <InlineCode>duplicate_reference</InlineCode> and nothing is sent to the
        provider.
      </Prose>

      <SectionHeading>Errors</SectionHeading>
      <ReferenceTable
        headers={["HTTP", "Code", "Meaning and what to do"]}
        rows={[
          {
            key: "invalid",
            cells: [
              "400",
              "invalid",
              "A field is missing or malformed. The offending fields are listed in error.details.",
            ],
          },
          {
            key: "duplicate_reference",
            cells: [
              "400",
              "duplicate_reference",
              "The reference was already used. Send a new one.",
            ],
          },
          {
            key: "invalid_reference",
            cells: ["400", "invalid_reference", "A reference is required."],
          },
          {
            key: "payment_failed",
            cells: [
              "400",
              "payment_failed",
              "The payment could not be initiated. Check that the provider is connected in your dashboard and that the request is valid.",
            ],
          },
          {
            key: "authentication_failed",
            cells: [
              "403",
              "authentication_failed",
              "Your Client-Secret-Key is missing or invalid.",
            ],
          },
          {
            key: "subscription",
            cells: [
              "403",
              "no_active_subscription, subscription_expired, no_plan_attached",
              "Live payments need an active subscription with a plan.",
            ],
          },
          {
            key: "limit",
            cells: [
              "429",
              "free_plan_limit_reached, plan_limit_reached",
              "You have used your plan's transaction allowance.",
            ],
          },
        ]}
      />
      <p className="text-slate-600 mb-8">
        See{" "}
        <Link to="/docs/errors" className="text-blue-600 hover:underline">
          Response and Errors
        </Link>{" "}
        for the full error format and every code.
      </p>

      <PageNav
        prev={{ label: "Response and Errors", to: "/docs/errors" }}
        next={{ label: "Smart Route", to: "/docs/smart-routes" }}
      />
    </DocPage>
  );
}

export default InitiatePayment;
