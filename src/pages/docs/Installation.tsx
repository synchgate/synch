import { Link } from "react-router-dom";
import { CodeBlock } from "../../components/docs/CodeBlock";
import {
  Callout,
  DocPage,
  InlineCode,
  PageHeader,
  PageNav,
  Prose,
  SectionHeading,
} from "../../components/docs/DocLayout";
import { SimpleExample } from "../../components/docs/SimpleExample";

function Installation() {
  return (
    <DocPage>
      <PageHeader title="Installation">
        SynchGate is a plain HTTPS JSON API, so there is nothing to install. Get
        your keys, connect a provider and send your first request.
      </PageHeader>

      <SectionHeading>Get started</SectionHeading>
      <ol className="list-decimal list-inside space-y-3 mb-8 text-slate-600 text-lg ml-2">
        <li>
          Create an account and copy your <strong>sandbox secret key</strong>{" "}
          from the dashboard.
        </li>
        <li>
          Connect a provider (Paystack, Flutterwave or Nomba) in the dashboard
          by adding its credentials. Requests fail until at least one provider
          is connected.
        </li>
        <li>
          Send a request with your key and the provider in the request body.
        </li>
        <li>
          When you are ready, switch to your <strong>live key</strong>.
        </li>
      </ol>

      <SectionHeading>Base URL</SectionHeading>
      <Prose>Every endpoint in these docs is relative to this base URL.</Prose>
      <CodeBlock code="https://api.synchgate.com/v1/api" />

      <SectionHeading>Authentication</SectionHeading>
      <Prose>
        Send your secret key in the <InlineCode>Client-Secret-Key</InlineCode>{" "}
        header of every request. Sandbox keys start with{" "}
        <InlineCode>synch_sk_sandbox_</InlineCode> and live keys with{" "}
        <InlineCode>synch_sk_live_</InlineCode>. See{" "}
        <Link
          to="/docs/authentication"
          className="text-blue-600 hover:underline"
        >
          Authentication
        </Link>{" "}
        for the details.
      </Prose>
      <CodeBlock code="Client-Secret-Key: synch_sk_sandbox_your_key_here" />
      <Prose>
        A missing or invalid key returns <InlineCode>403 Forbidden</InlineCode>.
      </Prose>

      <SimpleExample />

      <Callout title="Next steps">
        Read{" "}
        <Link to="/docs/errors" className="underline font-medium">
          Response and Errors
        </Link>{" "}
        to see how responses and failures are shaped, then go to{" "}
        <Link to="/docs/initiate-payment" className="underline font-medium">
          Initiate Payment
        </Link>{" "}
        for the full reference.
      </Callout>

      <PageNav
        prev={{ label: "Overview", to: "/docs" }}
        next={{ label: "Authentication", to: "/docs/authentication" }}
      />
    </DocPage>
  );
}

export default Installation;
