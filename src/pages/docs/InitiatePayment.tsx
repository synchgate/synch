import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/ui/CopyButton";
import { SimpleExample } from "../../components/docs/SimpleExample";

function InitiatePayment() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          COLLECT PAYMENTS
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Initiate Payment
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Creates a new payment transaction across any of our supported providers.
      </p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Base URL
      </h2>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between">
        <span>https://api.synchgate.com/v1/api</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="https://api.synchgate.com/v1/api" />
        </div>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 border-b border-slate-200 pb-2 text-black">
        Endpoint
      </h2>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between">
        <span>POST /initiate-payment/</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="POST /initiate-payment/" />
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg mb-3">
        Request Body
      </h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed border border-white/10">
        <pre>
          {`{
  "provider": "flutterwave",
  "email": "customer@example.com",
  "amount": 8000,
  "currency": "NGN",
  "callback_url": "https://synchgate.com/payments/",
  "reference": "unique_tx_ref_001"
}`}
        </pre>
      </div>

      <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#242424] text-slate-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Field</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-[#1e1e1e] text-slate-300">
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">provider</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4">
                Payment provider to route transaction to (e.g., paystack, flutterwave).
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">email</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4">Customer email address.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">amount</td>
              <td className="px-6 py-4 text-emerald-300">integer</td>
              <td className="px-6 py-4">Amount to charge</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">currency</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4">Transaction currency (e.g., NGN, USD, optional but defaults to NGN)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">
                callback_url
              </td>
              <td className="px-6 py-4 text-blue-300">url</td>
              <td className="px-6 py-4">The URL to redirect the customer after payment (optional)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">reference</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4">Unique transaction reference (optional)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg mb-3">
        Supported Providers
      </h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 shadow-inner border border-white/10">
        <div>paystack</div>
        <div>flutterwave</div>
        <div>nomba</div>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Routing Logic
      </h2>

      <p className="text-slate-600 mb-4">
        The current routing system uses{" "}
        <strong>explicit provider selection</strong>.
      </p>
      <p className="text-slate-600 mb-6">
        The provider is specified directly in the request payload, and the API routes the request to that specific gateway.
      </p>

      <p className="text-slate-900 font-bold text-lg mb-2 mt-8">
        Example Request (cURL)
      </p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`curl --location 'https://api.synchgate.com/v1/api/initiate-payment/' \\\n--header 'Client-Secret-Key: sk_live_your_key_here' \\\n--header 'Content-Type: application/json' \\\n--data-raw '{\n    "provider": "flutterwave",\n    "email": "customer@example.com",\n    "amount": 8000,\n    "currency": "NGN"\n}'`} />
        </div>
        <pre>
          {`curl --location 'https://api.synchgate.com/v1/api/initiate-payment/' \\
--header 'Client-Secret-Key: sk_live_your_key_here' \\
--header 'Content-Type: application/json' \\
--data-raw '{
    "provider": "flutterwave",
    "email": "customer@example.com",
    "amount": 8000,
    "currency": "NGN"
}'`}
        </pre>
      </div>

      <SimpleExample />

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Example Response
      </h2>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10">
        <pre>
          {`{
    "status": "success",
    "message": "Payment initiated successfully",
    "data": {
        "cleaned_data": {
            "payment_url": "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/b27556da90c41b410111",
            "amount": "10000.00",
            "currency": "NGN",
            "reference": "hdjdjfkfkjdjdj",
            "status": "success",
            "provider": "flutterwave"
        },
        "provider_data": {
            "data": {
                "status": "success",
                "message": "Hosted Link",
                "data": {
                    "link": "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/b27556da90c41b410111",
                    "tx_ref": "hdjdjfkfkjdjdj",
                    "amount": "10000.00",
                    "currency": "NGN",
                    "redirect_url": "https://fintech-platform-weld.vercel.app/"
                }
            }
        }
    },
    "meta": {
        "request_id": "41e97272-03b2-485c-a150-8e7c30737f3c",
        "timestamp": "2026-03-24T11:44:41.828466Z"
    }
}`}
        </pre>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Unified Response Format
      </h2>
      <p className="text-slate-600 mb-4">
        Fintech Platform normalizes responses from all providers into a single, consistent format.
      </p>
      <p className="text-slate-600 mb-12">
        This allows you to write one integration regardless of which underlying payment gateway you use.
      </p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Transaction Tracking
      </h2>
      <p className="text-slate-600 mb-3">All API transactions are tracked with one of the following states:</p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-amber-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10">
        <pre>
          {`pending   - Payment is waiting for customer action
success   - Payment was successfully processed
failed    - Payment was declined or failed
abandoned - Customer left the payment page`}
        </pre>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Error Handling
      </h2>
      <p className="text-slate-600 mb-6">
        All errors return a standard JSON structure with a descriptive message and error code.
      </p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10">
        <pre>
          {`{
    "status": "error",
    "message": "Invalid client secret key.",
    "error": {
        "code": "authentication_failed"
    }
}`}
        </pre>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/installation"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600 rotate-180" />
          </div>
          <div className="text-left min-w-0 pr-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Previous
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Installation
            </span>
          </div>
        </Link>
        <Link
          to="/docs/transaction-verification"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0 justify-end text-right"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Transaction Verification
            </span>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default InitiatePayment;
