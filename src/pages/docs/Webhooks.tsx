import { Link } from "react-router-dom";
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
} from "../../components/docs/DocLayout";

const payoutCompleted = `{
  "event": "payout.completed",
  "delivery_id": "WEBHOOK_payout-2026-000041_payout.completed",
  "created_at": "2026-09-19T09:14:52.310482+00:00",
  "data": {
    "transaction_id": "TXN-8F2K1M9Q4X",
    "reference": "payout-2026-000041",
    "transaction_type": "payout",
    "amount": "5000.00",
    "currency": "NGN",
    "status": "success",
    "payment_method": "bank_transfer",
    "payment_gateway": "paystack",
    "metadata": { "provider_reference": "TRF_x7d1kqz0f2" },
    "created_at": "2026-09-19T09:11:03.118240+00:00",
    "completed_at": "2026-09-19T09:14:52.301127+00:00"
  }
}`;

const handler = `app.post("/webhooks/synchgate", express.json(), async (req, res) => {
  const { event, data } = req.body;

  // Don't trust the body on its own. Ask SynchGate for the current status.
  const check = await fetch(
    \`https://api.synchgate.com/v1/api/transaction/verify/\${data.reference}/\`,
    { headers: { "Client-Secret-Key": process.env.SYNCHGATE_SECRET_KEY } },
  ).then((r) => r.json());

  if (check.data?.cleaned_data?.status === "success") {
    await markPaid(data.reference);
  }

  res.sendStatus(200); // anything other than 200 counts as not delivered
});`;

function Webhooks() {
  return (
    <DocPage>
      <PageHeader eyebrow="EVENTS" title="Webhooks">
        SynchGate can call your server when a payout that was still processing
        reaches its final status, so you don't have to poll for it.
      </PageHeader>

      <SectionHeading>Set your webhook URL</SectionHeading>
      <Prose>
        Add an HTTPS URL for each environment under{" "}
        <strong>Dashboard → API Keys</strong>. Sandbox and live have separate
        URLs, and events go to the URL of the key that made the request.
      </Prose>

      <SectionHeading>Events</SectionHeading>
      <ReferenceTable
        headers={["Event", "Sent when"]}
        rows={[
          {
            key: "payout.completed",
            cells: [
              "payout.completed",
              "A payout that was processing has been confirmed as paid by the provider.",
            ],
          },
          {
            key: "payout.failed",
            cells: [
              "payout.failed",
              "A payout that was processing has been confirmed as failed by the provider. It is safe to retry with a new reference.",
            ],
          },
          {
            key: "transaction",
            cells: [
              "transaction.completed, transaction.<status>",
              "A payment (collection) has been checked with the provider. Treat it as a prompt to verify, not as proof.",
            ],
          },
        ]}
      />
      <Callout title="Payouts that finish immediately">
        A payout the provider confirms while you wait is answered in the{" "}
        <Link to="/docs/initiate-transfer" className="underline font-medium">
          Initiate Transfer
        </Link>{" "}
        response and does not send a webhook. Webhooks cover the ones that
        finish later.
      </Callout>

      <SectionHeading>Payload</SectionHeading>
      <CodeBlock code={payoutCompleted} title="POST to your URL" />
      <ReferenceTable
        headers={["Header", "Value"]}
        rows={[
          {
            key: "event",
            cells: [
              "X-Synchgate-Event",
              "The event name, for example payout.completed.",
            ],
          },
          {
            key: "delivery",
            cells: [
              "X-Synchgate-Delivery-ID",
              "Unique to this delivery. Use it to ignore a repeat.",
            ],
          },
          {
            key: "timestamp",
            cells: [
              "X-Synchgate-Timestamp",
              "When SynchGate received the event.",
            ],
          },
        ]}
      />

      <SectionHeading>What to know before you rely on them</SectionHeading>
      <ul className="space-y-2 mb-8 text-slate-600 list-disc list-inside ml-2">
        <li>
          <strong>Respond with HTTP 200.</strong> Any other answer, or a timeout
          after 10 seconds, is recorded as not delivered.
        </li>
        <li>
          <strong>Deliveries are not retried.</strong> If your server was down,
          fetch the status with{" "}
          <Link
            to="/docs/transaction-verification"
            className="text-blue-600 hover:underline"
          >
            Transaction Verification
          </Link>
          .
        </li>
        <li>
          <strong>Deliveries are not signed yet.</strong> Anyone who learns your
          URL could post to it. Confirm a status with the verification endpoint
          before you release goods or funds, as below.
        </li>
      </ul>

      <CodeBlock code={handler} title="Confirm before you act" />

      <Prose>
        Store <InlineCode>delivery_id</InlineCode> and skip ones you have
        already handled.
      </Prose>

      <PageNav
        prev={{ label: "Initiate Transfer", to: "/docs/initiate-transfer" }}
        next={{ label: "PCI Compliance", to: "/docs/pci-compliance" }}
      />
    </DocPage>
  );
}

export default Webhooks;
