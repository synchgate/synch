import { CodeTabs } from "./CodeBlock";
import { SectionHeading } from "./DocLayout";
import { requestSnippets } from "./snippets";

const snippets = requestSnippets({
  method: "POST",
  path: "/initiate-payment/",
  body: {
    provider: "paystack",
    email: "customer@example.com",
    amount: 5000,
    currency: "NGN",
    reference: "order-2026-000123",
    callback_url: "https://yourdomain.com/payments/callback",
  },
});

export function SimpleExample() {
  return (
    <>
      <SectionHeading>Simple Example</SectionHeading>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Get started quickly by implementing our API in your preferred language.
        Select a tab below to see the implementation details.
      </p>
      <CodeTabs snippets={snippets} className="mb-12" />
    </>
  );
}
