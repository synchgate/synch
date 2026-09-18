import { CreditCard, Landmark, Layers, Server } from "lucide-react";
import type { FlowActor, FlowScenario } from "./FlowAnimation";

const YOU: FlowActor = { id: "you", label: "Your server", Icon: Server };
const SYNCH: FlowActor = {
  id: "synch",
  label: "SynchGate",
  Icon: Layers,
  accent: true,
};
const PROVIDER: FlowActor = {
  id: "provider",
  label: "Provider",
  Icon: CreditCard,
};
const BANK: FlowActor = { id: "bank", label: "Recipient bank", Icon: Landmark };

type Flow = { actors: FlowActor[]; scenarios: FlowScenario[] };

const paymentRequest = {
  title: "POST /initiate-payment/",
  code: `{
  "provider": "paystack",
  "email": "customer@example.com",
  "amount": 8000,
  "reference": "order-2026-000123"
}`,
};

export const paymentFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER],
  scenarios: [
    {
      id: "created",
      label: "Checkout created",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the provider, customer email, amount and your reference",
          kind: "request",
          payload: paymentRequest,
        },
        {
          from: "synch",
          to: "synch",
          label: "Checks your key and that the reference is unused",
        },
        {
          from: "synch",
          to: "provider",
          label: "Create a checkout with your provider credentials",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Returns a hosted checkout link",
          kind: "response",
        },
        {
          from: "synch",
          to: "synch",
          label: "Records the payment as pending",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with the normalised payment_url",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "cleaned_data": {
      "payment_url": "https://checkout.paystack.com/abc123xyz",
      "reference": "order-2026-000123",
      "status": "success",
      "provider": "paystack"
    }
  }
}`,
          },
        },
        {
          from: "you",
          to: "you",
          label: "Redirect your customer to payment_url",
        },
        {
          from: "provider",
          to: "provider",
          label: "The customer pays on the provider's hosted page",
        },
        {
          from: "you",
          to: "you",
          label:
            "Customer returns to callback_url. Verify the payment before delivering value",
        },
      ],
    },
    {
      id: "duplicate",
      label: "Duplicate reference",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send a payment with a reference you already used",
          kind: "request",
          payload: paymentRequest,
        },
        {
          from: "synch",
          to: "synch",
          label: "Finds order-2026-000123 already exists on your account",
          kind: "error",
        },
        {
          from: "synch",
          to: "you",
          label: "400 duplicate_reference. Nothing is sent to the provider",
          kind: "error",
          payload: {
            title: "400 Bad Request",
            code: `{
  "status": "error",
  "message": "Transaction reference already exists. Please use a unique reference.",
  "errors": { "code": "duplicate_reference" }
}`,
          },
        },
      ],
    },
  ],
};

export const smartRouteFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER],
  scenarios: [
    {
      id: "policy",
      label: "Your rule matches",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the payment without naming a provider",
          kind: "request",
          payload: {
            title: "POST /initiate-payment/smart-route/",
            code: `{
  "email": "customer@example.com",
  "amount": 500000,
  "currency": "NGN",
  "reference": "order-2026-000124"
}`,
          },
        },
        {
          from: "synch",
          to: "synch",
          label:
            "Checks your active policy in priority order. Rule 'Large payments' matches",
        },
        {
          from: "synch",
          to: "provider",
          label: "Create the checkout on the provider the rule names",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Returns a hosted checkout link",
          kind: "response",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK, plus a routing object saying what was chosen",
          kind: "response",
          payload: {
            title: "200 OK (routing)",
            code: `"routing": {
  "provider": "flutterwave",
  "payment_channel": null,
  "route_type": "smart_policy",
  "rule_name": "Large payments"
}`,
          },
        },
      ],
    },
    {
      id: "score",
      label: "Performance scoring",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the payment without naming a provider",
          kind: "request",
          payload: {
            title: "POST /initiate-payment/smart-route/",
            code: `{
  "email": "customer@example.com",
  "amount": 8000,
  "reference": "order-2026-000125"
}`,
          },
        },
        {
          from: "synch",
          to: "synch",
          label:
            "No active policy or matching rule, so it falls back to scoring",
        },
        {
          from: "synch",
          to: "synch",
          label:
            "Scores your providers on success rate and volume over the last hour",
        },
        {
          from: "synch",
          to: "provider",
          label: "Create the checkout on the best-scoring provider",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Returns a hosted checkout link",
          kind: "response",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with route_type smart_score",
          kind: "response",
          payload: {
            title: "200 OK (routing)",
            code: `"routing": {
  "provider": "paystack",
  "payment_channel": null,
  "route_type": "smart_score",
  "rule_name": null
}`,
          },
        },
      ],
    },
  ],
};

export const verificationFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER],
  scenarios: [
    {
      id: "paid",
      label: "Payment completed",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Ask for the payment's status using your reference",
          kind: "request",
          payload: {
            title: "GET /transaction/verify/order-2026-000123/",
            code: "Client-Secret-Key: synch_sk_sandbox_your_key_here",
          },
        },
        {
          from: "synch",
          to: "provider",
          label: "Ask the provider for the payment's current state",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "The payment was completed",
          kind: "response",
        },
        {
          from: "synch",
          to: "synch",
          label: "Updates the stored transaction",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with status success. Safe to deliver value",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Verification requested",
  "data": {
    "cleaned_data": {
      "provider": "paystack",
      "status": "success",
      "reference": "order-2026-000123",
      "currency": "NGN"
    }
  }
}`,
          },
        },
      ],
    },
    {
      id: "pending",
      label: "Not paid yet",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Ask for the payment's status using your reference",
          kind: "request",
          payload: {
            title: "GET /transaction/verify/order-2026-000123/",
            code: "Client-Secret-Key: synch_sk_sandbox_your_key_here",
          },
        },
        {
          from: "synch",
          to: "provider",
          label: "Ask the provider for the payment's current state",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "The customer has not finished paying",
          kind: "response",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with status pending. Check again shortly",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Verification requested",
  "data": {
    "cleaned_data": {
      "provider": "paystack",
      "status": "pending",
      "reference": "order-2026-000123"
    }
  }
}`,
          },
        },
      ],
    },
  ],
};

export const banksFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER],
  scenarios: [
    {
      id: "list",
      label: "List banks",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Ask for a provider's banks",
          kind: "request",
          payload: {
            title: "GET /banks/?provider=paystack",
            code: "Client-Secret-Key: synch_sk_sandbox_your_key_here",
          },
        },
        {
          from: "synch",
          to: "provider",
          label: "Fetch the banks the provider supports",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Returns its own bank list",
          kind: "response",
        },
        {
          from: "synch",
          to: "synch",
          label: "Reduces every bank to a name and a code",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK. Use each code as bank_code when transferring",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "List of NGN banks",
  "data": [
    { "name": "Access Bank", "code": "044" },
    { "name": "GTBank", "code": "058" }
  ]
}`,
          },
        },
      ],
    },
  ],
};

export const resolveFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER],
  scenarios: [
    {
      id: "live",
      label: "Live key",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the account number and the bank's code",
          kind: "request",
          payload: {
            title: "POST /bank/resolve/",
            code: `{
  "provider": "paystack",
  "account_number": "0123456789",
  "code": "058"
}`,
          },
        },
        {
          from: "synch",
          to: "provider",
          label: "Look the account up with the provider",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Returns the name registered on the account",
          kind: "response",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with accountName. Confirm it before paying out",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Bank Account Details",
  "data": {
    "accountName": "ADA OBI",
    "accountNumber": "0123456789"
  }
}`,
          },
        },
      ],
    },
    {
      id: "sandbox",
      label: "Sandbox key",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the same request with a sandbox key",
          kind: "request",
          payload: {
            title: "POST /bank/resolve/",
            code: `{
  "provider": "paystack",
  "account_number": "0123456789",
  "code": "058"
}`,
          },
        },
        {
          from: "synch",
          to: "synch",
          label: "Sandbox key detected, so no provider lookup is made",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with a fixed sample account",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Bank Account Details (Use live key to get actual account details)",
  "data": {
    "accountName": "<fixed sample name>",
    "accountNumber": "<fixed sample number>"
  }
}`,
          },
        },
      ],
    },
  ],
};

const transferRequest = {
  title: "POST /initiate-transfer/",
  code: `{
  "provider": "paystack",
  "amount": 5000,
  "account_number": "0123456789",
  "account_name": "Ada Obi",
  "bank_code": "058",
  "reference": "payout-2026-000001"
}`,
};

export const transferFlow: Flow = {
  actors: [YOU, SYNCH, PROVIDER, BANK],
  scenarios: [
    {
      id: "accepted",
      label: "Accepted",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the recipient's details, amount and a unique reference",
          kind: "request",
          payload: transferRequest,
        },
        {
          from: "synch",
          to: "synch",
          label: "Checks your key, your plan and that the reference is unused",
        },
        {
          from: "synch",
          to: "synch",
          label: "Records the payout as pending before calling the provider",
        },
        {
          from: "synch",
          to: "provider",
          label: "Send the payout with your provider credentials",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Accepts and queues the transfer",
          kind: "response",
        },
        {
          from: "synch",
          to: "synch",
          label: "Marks the transfer processing",
        },
        {
          from: "synch",
          to: "you",
          label: "200 OK with status processing",
          kind: "response",
          payload: {
            title: "200 OK",
            code: `{
  "status": "success",
  "message": "Transfer initiated successfully",
  "data": {
    "cleaned_data": {
      "reference": "payout-2026-000001",
      "provider_reference": "TRF_1ptvuv321ahaa7q",
      "amount": "5000.00",
      "status": "processing",
      "provider": "paystack",
      "transaction_id": "TXN-3F9A1C7D2B04"
    }
  }
}`,
          },
        },
        {
          from: "provider",
          to: "bank",
          label: "The provider completes the payout to the account",
          kind: "response",
          dashed: true,
        },
      ],
    },
    {
      id: "balance",
      label: "Insufficient balance",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send a transfer larger than your provider balance",
          kind: "request",
          payload: transferRequest,
        },
        {
          from: "synch",
          to: "synch",
          label: "Records the payout as pending",
        },
        {
          from: "synch",
          to: "provider",
          label: "Send the payout with your provider credentials",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "Rejects it: the balance is not enough",
          kind: "error",
        },
        {
          from: "synch",
          to: "synch",
          label: "Marks the transfer failed",
          kind: "error",
        },
        {
          from: "synch",
          to: "you",
          label:
            "400 insufficient_balance. Top up, then retry with a new reference",
          kind: "error",
          payload: {
            title: "400 Bad Request",
            code: `{
  "status": "error",
  "message": "Insufficient balance on your payment provider account to complete this transfer.",
  "errors": { "code": "insufficient_balance" }
}`,
          },
        },
      ],
    },
    {
      id: "timeout",
      label: "Timeout, safe retry",
      steps: [
        {
          from: "you",
          to: "synch",
          label: "Send the transfer",
          kind: "request",
          payload: transferRequest,
        },
        {
          from: "synch",
          to: "synch",
          label: "Records the payout as pending",
        },
        {
          from: "synch",
          to: "provider",
          label: "Send the payout with your provider credentials",
          kind: "request",
        },
        {
          from: "provider",
          to: "synch",
          label: "No answer before the timeout",
          kind: "error",
          dashed: true,
        },
        {
          from: "synch",
          to: "synch",
          label:
            "Leaves the transfer processing, because it may still complete",
        },
        {
          from: "synch",
          to: "you",
          label: "502 transfer_outcome_unknown. Do not use a new reference",
          kind: "error",
          payload: {
            title: "502 Bad Gateway",
            code: `{
  "status": "error",
  "message": "The transfer could not be confirmed with the provider and may still complete. Do not retry with a new reference.",
  "errors": { "code": "transfer_outcome_unknown" }
}`,
          },
        },
        {
          from: "you",
          to: "synch",
          label: "Retry with the same reference",
          kind: "request",
        },
        {
          from: "synch",
          to: "you",
          label: "400 duplicate_reference confirms SynchGate already has it",
          kind: "error",
          payload: {
            title: "400 Bad Request",
            code: `{
  "status": "error",
  "message": "Transaction reference already exists. Please use a unique reference.",
  "errors": { "code": "duplicate_reference" }
}`,
          },
        },
      ],
    },
  ],
};
