import { ArrowRight, Brain, Cpu, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/ui/CopyButton";

function SmartRoutes() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          COLLECT PAYMENTS
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Smart Route Payment API
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Initiate a payment using SynchGate’s Smart Routing Engine, which automatically selects the best available payment provider based on real-time performance metrics such as success rate and transaction volume.
      </p>

      {/* Overview Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black flex items-center gap-3">
        <Brain className="w-8 h-8 text-blue-600" /> Overview
      </h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        The Smart Route API abstracts multiple payment providers behind a single endpoint. Instead of manually selecting a provider, the system dynamically determines the optimal provider for each transaction.
        This follows the general concept of payment initiation APIs, which are designed to submit payment instructions for processing and transfer funds between accounts.
      </p>

      {/* How It Works Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black flex items-center gap-3">
        <Cpu className="w-8 h-8 text-blue-600" /> How It Works
      </h2>
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="font-bold text-slate-900 mb-2">1. Merchant Configuration Validation</h3>
          <ul className="list-disc ml-6 text-slate-600 space-y-1">
            <li>At least 2 providers configured.</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="font-bold text-slate-900 mb-2">2. Smart Engine Analysis</h3>
          <ul className="list-disc ml-6 text-slate-600 space-y-1">
            <li>Analyzes historical transaction data.</li>
            <li>Computes provider success rates.</li>
            <li>Considers transaction volume.</li>
            <li>Applies a scoring algorithm.</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
          <p>3. The <b>best provider</b> is selected automatically and payment is initiated.</p>
        </div>
      </div>

      {/* Authentication Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Authentication
      </h2>
      <p className="text-slate-600 mb-4">
        Use your Client Secret Key associated with the environment:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-900 rounded-xl border border-white/10">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Live Environment</p>
          <code className="text-blue-300 text-sm">synch_sk_live_...</code>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-white/10">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Sandbox Environment</p>
          <code className="text-blue-300 text-sm">synch_sk_test_...</code>
        </div>
      </div>
      <p className="text-slate-600 mb-8">
        Include in your request header: <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm">Authorization: Bearer YOUR_SECRET_KEY</code>
      </p>

      {/* Request Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Endpoint
      </h2>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between">
        <span>POST /v1/api/initiate-payment/smart-route/</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="POST /v1/api/initiate-payment/smart-route/" />
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg mb-3">Request Body</h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`{\n "email": "customer@email.com",\n "amount": 5000,\n "currency": "NGN",\n "reference": "txn_123456789",\n "callback_url": "https://yourdomain.com/callback"\n}`} />
        </div>
        <pre>
          {`{
 "email": "customer@email.com",
 "amount": 5000,
 "currency": "NGN",
 "reference": "txn_123456789",
 "callback_url": "https://yourdomain.com/callback"
}`}
        </pre>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg mb-3">Request Parameters</h3>
      <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#242424] text-slate-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Field</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-center">Required</th>
              <th className="px-6 py-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-[#1e1e1e] text-slate-300 font-mono">
            <tr>
              <td className="px-6 py-4 text-amber-300">email</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4 text-center text-emerald-400">✅</td>
              <td className="px-6 py-4 font-sans italic text-slate-400">Customer email address</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-amber-300">amount</td>
              <td className="px-6 py-4 text-emerald-300">integer</td>
              <td className="px-6 py-4 text-center text-emerald-400">✅</td>
              <td className="px-6 py-4 font-sans italic text-slate-400">Amount in lowest currency unit (e.g. kobo)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-amber-300">currency</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4 text-center text-rose-400">❌</td>
              <td className="px-6 py-4 font-sans italic text-slate-400">Currency code (default: NGN)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-amber-300">reference</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4 text-center text-emerald-400">✅</td>
              <td className="px-6 py-4 font-sans italic text-slate-400">Unique transaction reference</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-amber-300">callback_url</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4 text-center text-rose-400">❌</td>
              <td className="px-6 py-4 font-sans italic text-slate-400">URL for payment completion redirect</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Response Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black text-black">
        Response
      </h2>
      <h3 className="font-semibold text-emerald-600 text-sm uppercase tracking-wider mb-3">✅ Success Response</h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner border border-white/10">
        <pre>
          {`{
 "status": "success",
 "provider": "paystack",
 "payment_link": "https://checkout.paystack.com/xyz",
 "reference": "txn_123456789"
}`}
        </pre>
      </div>

      <h3 className="font-semibold text-rose-600 text-sm uppercase tracking-wider mb-3">❌ Error Response</h3>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner border border-white/10">
        <pre>
          {`{
 "status": "error",
 "message": "Live environment has no providers with credentials."
}`}
        </pre>
      </div>

      {/* Logic Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black flex items-center gap-3">
        <Brain className="w-8 h-8 text-blue-600" /> Smart Routing Logic
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> 1. Success Rate
          </h4>
          <p className="text-sm text-slate-600">Percentage of successful transactions per provider calculated in real-time.</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" /> 2. Transaction Volume
          </h4>
          <p className="text-sm text-slate-600">Providers with sufficient usage and proven stability are prioritized.</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" /> 3. Cold Start Handling
          </h4>
          <p className="text-sm text-slate-600">New providers may be temporarily boosted to gather performance data.</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-500" /> 4. Environment Isolation
          </h4>
          <p className="text-sm text-slate-600">Routing optimizations are performed separately for sandbox and live environments.</p>
        </div>
      </div>

      {/* Validation Rules Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Validation Rules
      </h2>
      <p className="text-slate-600 mb-6">Before routing, the system ensures:</p>
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-3 text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">✅</div>
          <span>Both sandbox and live environments are configured</span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">✅</div>
          <span>Each environment has at least one provider with credentials</span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">✅</div>
          <span>Current environment has at least 2 active providers</span>
        </div>
      </div>

      {/* Fallback Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black flex items-center gap-3 font-black">
        <RefreshCw className="w-8 h-8 text-blue-600" /> Fallback Behavior
      </h2>
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl text-slate-700 mb-12 italic">
        <p className="mb-2"><b>If no historical data exists:</b> The system performs a random selection among valid providers.</p>
        <p><b>If a provider fails (future enhancement):</b> Automatic failover to the next best provider will be introduced.</p>
      </div>

      {/* Example Section */}
      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black font-black">
        🧪 Example cURL
      </h2>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`curl -X POST https://api.synchgate.com/v1/api/initiate-payment/smart-route/ \\\n -H "Authorization: Bearer synch_sk_test_xxx" \\\n -H "Content-Type: application/json" \\\n -d '{\n   "email": "test@email.com",\n   "amount": 5000,\n   "reference": "txn_123456",\n   "callback_url": "https://example.com/callback"\n }'`} />
        </div>
        <pre>
          {`curl -X POST https://api.synchgate.com/v1/api/initiate-payment/smart-route/ \\
 -H "Authorization: Bearer synch_sk_test_xxx" \\
 -H "Content-Type: application/json" \\
 -d '{
   "email": "test@email.com",
   "amount": 5000,
   "reference": "txn_123456",
   "callback_url": "https://example.com/callback"
 }'`}
        </pre>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/initiate-payment"
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
              Initiate Payment
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

export default SmartRoutes;
