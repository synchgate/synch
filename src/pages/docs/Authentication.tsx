import { KeyRound } from "lucide-react";
import { ReferenceTable } from "../../components/docs/ApiReference";
import { CodeBlock, CodeTabs } from "../../components/docs/CodeBlock";
import {
  Callout,
  DocPage,
  InlineCode,
  PageHeader,
  PageNav,
  Prose,
  SectionHeading,
} from "../../components/docs/DocLayout";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "GET",
  path: "/banks/",
  query: { provider: "paystack" },
});

const authError = `{
  "status": "error",
  "message": "Invalid client secret key.",
  "error": {
    "code": "authentication_failed",
    "details": {
      "detail": "Invalid client secret key."
    }
  },
  "meta": {
    "request_id": "d1b75731-198a-487b-ba66-249538b9af36",
    "timestamp": "2026-09-18T20:26:39.520495Z"
  }
}`;

function Authentication() {
  return (
    <DocPage>
      <PageHeader title="Authentication">
        The SynchGate API authenticates every request with your secret key, sent
        in the <InlineCode>Client-Secret-Key</InlineCode> header. You can view
        and regenerate your keys in the SynchGate dashboard.
      </PageHeader>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-10 flex gap-4 text-yellow-800 shadow-sm">
        <KeyRound className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold mb-1">Keep your keys safe</h4>
          <p className="text-sm">
            Your secret key can move money. Keep it on your server, load it from
            an environment variable, and never put it in client-side code, a
            mobile app or a public repository. If a key is exposed, regenerate
            it from the dashboard straight away.
          </p>
        </div>
      </div>

      <SectionHeading>Authenticating requests</SectionHeading>
      <Prose>
        Add your secret key to the header of every request. All requests must be
        made over HTTPS. Requests without a valid key are rejected.
      </Prose>
      <CodeBlock code="Client-Secret-Key: synch_sk_live_your_key_here" />
      <CodeTabs snippets={snippets} />

      <SectionHeading>Sandbox and live keys</SectionHeading>
      <Prose>
        Your account has one key per environment. The prefix tells you which
        environment a key belongs to, and the environment decides where the
        request is recorded.
      </Prose>
      <ReferenceTable
        headers={["Key prefix", "Environment", "Behaviour"]}
        rows={[
          {
            key: "sandbox",
            cells: [
              "synch_sk_sandbox_",
              "Sandbox",
              "For building and testing. Requests use the test credentials you configured for the provider and are recorded separately from live data.",
            ],
          },
          {
            key: "live",
            cells: [
              "synch_sk_live_",
              "Live",
              "Real transactions. Only works once your account is in live mode. Each successful transaction is paid for from your wallet.",
            ],
          },
        ]}
      />

      <SectionHeading>Authentication errors</SectionHeading>
      <Prose>
        A missing or invalid key returns HTTP <InlineCode>403</InlineCode> with
        the code <InlineCode>authentication_failed</InlineCode>.
      </Prose>
      <CodeBlock code={authError} title="403 Forbidden" />
      <ReferenceTable
        headers={["Message", "Cause"]}
        rows={[
          {
            key: "missing",
            cells: [
              "Missing API credentials.",
              "The Client-Secret-Key header was not sent.",
            ],
          },
          {
            key: "invalid",
            cells: [
              "Invalid client secret key.",
              "The key does not exist, was regenerated, or its client is not active.",
            ],
          },
          {
            key: "live-mode",
            cells: [
              "You currently provided live keys but your account is not in live mode.",
              "A live key was used before your account was switched to live mode.",
            ],
          },
        ]}
      />

      <Callout title="Rotating a key">
        Regenerating a key invalidates the old one immediately. Update your
        deployment first, or requests will fail until you do.
      </Callout>

      <PageNav
        prev={{ label: "Installation", to: "/docs/installation" }}
        next={{ label: "Response and Errors", to: "/docs/errors" }}
      />
    </DocPage>
  );
}

export default Authentication;
