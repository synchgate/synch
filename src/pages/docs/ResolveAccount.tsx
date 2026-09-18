import { Link } from "react-router-dom";
import { Endpoint, ParamTable } from "../../components/docs/ApiReference";
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
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "POST",
  path: "/bank/resolve/",
  body: {
    provider: "paystack",
    account_number: "0123456789",
    code: "058",
  },
});

const successResponse = `{
  "status": "success",
  "message": "Bank Account Details",
  "data": {
    "accountName": "ADA OBI",
    "accountNumber": "0123456789"
  },
  "meta": {
    "request_id": "922bdcd8-b5e1-4bcc-9f8f-45ec0dc174bb",
    "timestamp": "2026-09-18T02:03:28.369634Z"
  }
}`;

function ResolveAccount() {
  return (
    <DocPage>
      <PageHeader eyebrow="TRANSFER" title="Resolve Account">
        Look up the name on a bank account before you send money to it, so a
        typo in the account number never sends a payout to the wrong person.
      </PageHeader>

      <SupportedProviders />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="POST" path="/bank/resolve/" />
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
      <Callout title="Sandbox returns a sample account">
        With a sandbox key this endpoint does not look the account up. It
        returns a fixed sample account, so use a live key to resolve real
        accounts.
      </Callout>

      <SectionHeading>Request body</SectionHeading>
      <ParamTable
        params={[
          {
            name: "provider",
            type: "string",
            required: true,
            description:
              "Provider to resolve the account with, for example paystack, flutterwave or nomba.",
          },
          {
            name: "account_number",
            type: "string",
            required: true,
            description: "The bank account number to look up.",
          },
          {
            name: "code",
            type: "string",
            required: true,
            description: (
              <>
                The bank's code, from the{" "}
                <Link to="/docs/banks" className="text-blue-300 underline">
                  Banks API
                </Link>
                .
              </>
            ),
          },
        ]}
      />

      <SectionHeading>Example request</SectionHeading>
      <CodeTabs snippets={snippets} />

      <SectionHeading>Response</SectionHeading>
      <CodeBlock code={successResponse} title="200 OK" />
      <Prose>
        <InlineCode>data.accountName</InlineCode> is the name registered on the
        account. Show it to your user, or compare it with the name you expect,
        and pass it as <InlineCode>account_name</InlineCode> when you initiate
        the transfer.
      </Prose>

      <PageNav
        prev={{ label: "Banks API", to: "/docs/banks" }}
        next={{ label: "Initiate Transfer", to: "/docs/initiate-transfer" }}
      />
    </DocPage>
  );
}

export default ResolveAccount;
