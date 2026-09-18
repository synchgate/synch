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
} from "../../components/docs/DocLayout";
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { requestSnippets } from "../../components/docs/snippets";

const snippets = requestSnippets({
  method: "GET",
  path: "/banks/",
  query: { provider: "paystack" },
});

const successResponse = `{
  "status": "success",
  "message": "List of NGN banks",
  "data": [
    {
      "name": "Access Bank",
      "code": "044"
    },
    {
      "name": "GTBank",
      "code": "058"
    },
    {
      "name": "Zenith Bank",
      "code": "057"
    }
  ],
  "meta": {
    "request_id": "f7d3ad77-f327-4314-9c64-00501d9ebaec",
    "timestamp": "2026-09-18T12:44:01.060968Z"
  }
}`;

function BanksApi() {
  return (
    <DocPage>
      <PageHeader eyebrow="TRANSFER" title="Banks API">
        Retrieve the banks a provider supports for transfers, with the codes you
        need to send money to them.
      </PageHeader>

      <SupportedProviders />

      <SectionHeading>Endpoint</SectionHeading>
      <Endpoint method="GET" path="/banks/" />
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

      <SectionHeading>Query parameters</SectionHeading>
      <ParamTable
        params={[
          {
            name: "provider",
            type: "string",
            required: true,
            description:
              "Provider whose banks you want, for example paystack, flutterwave or nomba.",
          },
        ]}
      />

      <SectionHeading>Example request</SectionHeading>
      <CodeTabs snippets={snippets} />

      <SectionHeading>Response</SectionHeading>
      <CodeBlock code={successResponse} title="200 OK" />
      <ReferenceTable
        headers={["Field", "Description"]}
        rows={[
          {
            key: "name",
            cells: ["name", "The bank's name."],
          },
          {
            key: "code",
            cells: [
              "code",
              <>
                The bank's code. Pass it as <InlineCode>code</InlineCode> to{" "}
                <Link
                  to="/docs/resolve-account"
                  className="text-blue-300 underline"
                >
                  Resolve Account
                </Link>{" "}
                and as <InlineCode>bank_code</InlineCode> to{" "}
                <Link
                  to="/docs/initiate-transfer"
                  className="text-blue-300 underline"
                >
                  Initiate Transfer
                </Link>
                .
              </>,
            ],
          },
        ]}
      />

      <Callout title="Codes belong to a provider">
        Bank codes are not the same across providers, so always use the list
        from the provider you will transfer with.
      </Callout>

      <PageNav
        prev={{
          label: "Transaction Verification",
          to: "/docs/transaction-verification",
        }}
        next={{ label: "Resolve Account", to: "/docs/resolve-account" }}
      />
    </DocPage>
  );
}

export default BanksApi;
