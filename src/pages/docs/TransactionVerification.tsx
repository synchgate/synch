import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SupportedProviders } from "../../components/docs/SupportedProviders";
import { CopyButton } from "../../components/ui/CopyButton";

function TransactionVerification() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          COLLECT PAYMENTS
        </span>
      </div>

      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Transaction Verification
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Verifies the status of a specific transaction using its reference.
      </p>

      <SupportedProviders />

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
        <span>
          GET /transaction/verify/{"{"}reference{"}"}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="GET /transaction/verify/{reference}" />
        </div>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Path Parameters
      </h2>

      <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#242424] text-slate-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Parameter</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-[#1e1e1e] text-slate-300">
            <tr>
              <td className="px-6 py-4 font-mono text-amber-300">reference</td>
              <td className="px-6 py-4 text-blue-300">string</td>
              <td className="px-6 py-4">
                The unique transaction reference provided during initiation.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-slate-900 font-bold text-lg mb-2 mt-8">
        Example Request (cURL)
      </p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton
            textToCopy={`curl --location 'https://api.synchgate.com/v1/api/transaction/verify/{reference}' \\\n--header 'Client-Secret-Key: synch_sk_sandbox_wfpyGcOU0onMQ8zpAjnpEUVMTV8a_V5u00JgPftKzSI' \\\n--header 'Cookie: csrftoken=hDIER5CMGlOCnHVMhxHn8WYgoSm5vi8E' \\\n--data ''`}
          />
        </div>
        <pre>
          {`curl --location 'https://api.synchgate.com/v1/api/transaction/verify/{reference}' \\
--header 'Client-Secret-Key: synch_sk_sandbox_wfpyGcOU0onMQ8zpAjnpEUVMTV8a_V5u00JgPftKzSI' \\
--header 'Cookie: csrftoken=hDIER5CMGlOCnHVMhxHn8WYgoSm5vi8E' \\
--data ''`}
        </pre>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Example Response
      </h2>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-12 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton
            textToCopy={`{\n    "status": "success",\n    "message": "Verification requested",\n    "data": {\n        "cleaned_data": {\n            "provider": "paystack",\n            "status": "success",\n            "amount": 10000,\n            "reference": "bkhwialqas",\n            "currency": "NGN"\n        },\n        "provider_response": {\n            "status": true,\n            "message": "Verification successful",\n            "data": {\n                "id": 5990835342,\n                "domain": "test",\n                "status": "success",\n                "reference": "bkhwialqas",\n                "receipt_number": null,\n                "amount": 10000,\n                "message": null,\n                "gateway_response": "Successful",\n                "paid_at": "2026-03-31T23:50:04.000Z",\n                "created_at": "2026-03-31T23:49:52.000Z",\n                "channel": "card",\n                "currency": "NGN",\n                "ip_address": "102.89.47.66",\n                "metadata": {\n                    "amount": "100.00"\n                }\n            }\n        }\n    },\n    "meta": {\n        "request_id": "cf0fa31c-d43a-43d3-bc3a-0d41d7bdb18b",\n        "timestamp": "2026-04-01T12:46:41.387939Z"\n    }\n}`}
          />
        </div>
        <pre>
          {`{
    "status": "success",
    "message": "Verification requested",
    "data": {
        "cleaned_data": {
            "provider": "paystack",
            "status": "success",
            "amount": 10000,
            "reference": "bkhwialqas",
            "currency": "NGN"
        },
        "provider_response": {
            "status": true,
            "message": "Verification successful",
            "data": {
                "id": 5990835342,
                "domain": "test",
                "status": "success",
                "reference": "bkhwialqas",
                "receipt_number": null,
                "amount": 10000,
                "message": null,
                "gateway_response": "Successful",
                "paid_at": "2026-03-31T23:50:04.000Z",
                "created_at": "2026-03-31T23:49:52.000Z",
                "channel": "card",
                "currency": "NGN",
                "ip_address": "102.89.47.66",
                "metadata": {
                    "amount": "100.00"
                }
            }
        }
    },
    "meta": {
        "request_id": "cf0fa31c-d43a-43d3-bc3a-0d41d7bdb18b",
        "timestamp": "2026-04-01T12:46:41.387939Z"
    }
}`}
        </pre>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/initiate-payment"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
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
        <div></div>
      </div>
    </div>
  );
}

export default TransactionVerification;
