import { useState } from "react";
import { ArrowRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/ui/CopyButton";

function Installation() {
  const [activeTab, setActiveTab] = useState("javascript");

  const languages = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "php", label: "PHP" },
    { id: "ruby", label: "Ruby" },
    { id: "java", label: "Java" },
  ];

  const codeSnippets: Record<string, string> = {
    javascript: `const response = await fetch('https://api.synchgate.com/v1/api/initiate-payment/', {
  method: 'POST',
  headers: {
    'Client-Secret-Key': 'synch_live_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'paystack',
    amount: 5000,
    email: 'user@example.com',
    reference: "kskfksjf",
    callback_url: "https://your-domain.com/payment-success",
    currency: "NGN",
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://api.synchgate.com/v1/api/initiate-payment/"
payload = {
    "provider": "paystack",
    "amount": 5000,
    "email": "user@example.com",
    "reference": "kskfksjf",
    "callback_url": "https://your-domain.com/payment-success",
    "currency": "NGN",
}
headers = {
    "Client-Secret-Key": "synch_live_your_key",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.synchgate.com/v1/api/initiate-payment/",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    "provider" => "paystack",
    "amount" => 5000,
    "email" => "user@example.com",
    "reference": "kskfksjf",
    "callback_url": "https://your-domain.com/payment-success",
    "currency": "NGN",
  ]),
  CURLOPT_HTTPHEADER => [
    "Client-Secret-Key: synch_live_your_key",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
    ruby: `require 'net/http'
require 'json'

uri = URI('https://api.synchgate.com/v1/api/initiate-payment/')
req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
req['Client-Secret-Key'] = 'synch_live_your_key'
req.body = {
  provider: 'paystack',
  amount: 5000,
  email: 'user@example.com',
  reference: "kskfksjf",
  callback_url: "https://your-domain.com/payment-success",
  currency: "NGN",
}.to_json

res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(req)
end

puts res.body`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.synchgate.com/v1/api/initiate-payment/"))
    .header("Client-Secret-Key", "synch_live_your_key")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"provider\\":\\"paystack\\",\\"amount\\":5000,\\"email\\":\\"user@example.com\\, \\"reference\\":\\"kskfksjf\\", \\"callback_url\\":\\"https://your-domain.com/payment-success\\", \\"currency\\":\\"NGN\\"}"
    ))
    .build();

client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println);`,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        Installation
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        To begin using the SynchGate API:
      </p>

      <ol className="list-decimal list-inside space-y-3 mb-12 text-slate-600 text-lg ml-2">
        <li>Obtain your API keys</li>
        <li>Send payment requests to our API</li>
        <li>Specify the provider in your request payload</li>
      </ol>

      <h2 className="font-['Outfit'] text-2xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Base URL
      </h2>

      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-amber-200 mb-6 shadow-inner overflow-x-auto relative group flex items-center justify-between">
        <span>https://api.synchgate.com/v1</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy="https://api.synchgate.com/v1" />
        </div>
      </div>

      <p className="text-slate-600 mb-12">Local development example:</p>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Authentication
      </h2>
      <p className="text-slate-600 mb-6">
        All requests must include your <strong>Client Secret Key</strong>.
      </p>

      <h3 className="font-semibold text-slate-900 text-xl mb-3">Header</h3>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-slate-300 mb-12 shadow-inner overflow-x-auto space-y-2">
        <div>
          <span className="text-emerald-300">Client-Secret-Key:</span>{" "}
          synch_live_xxxxxxxx
        </div>
      </div>

      <p className="text-slate-900 font-bold text-lg mb-2 mt-8">
        Example
      </p>
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono text-slate-300 mb-8 overflow-x-auto shadow-inner leading-relaxed border border-white/10 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton textToCopy={`curl --location 'http://payinfraterminal.onrender.com/v1/api/initiate-payment/' \\\n--header 'Client-Secret-Key: pit_sk_live_U2C8HtHdlHPRvHcjRBYBYn9DyZPJEf2o_xZqQkUFIf0' \\\n--header 'Content-Type: application/json' `} />
        </div>
        <pre>
          {`curl --location 'http://payinfraterminal.onrender.com/v1/api/initiate-payment/' \\
--header 'Client-Secret-Key: pit_sk_live_U2C8HtHdlHPRvHcjRBYBYn9DyZPJEf2o_xZqQkUFIf0' \\
--header 'Content-Type: application/json' `}
        </pre>
      </div>

      <p className="text-slate-600 mb-3">
        If authentication fails, the API will return:
      </p>
      <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-blue-300 mb-12 shadow-inner overflow-x-auto border border-white/10">
        401 Unauthorized
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Simple Example
      </h2>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Get started quickly by implementing our API in your preferred language. Select a tab below to see the implementation details.
      </p>

      {/* Multilingual Code Editor */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
        {/* Tab Header */}
        <div className="flex items-center gap-1 bg-[#252525] px-4 pt-2 overflow-x-auto no-scrollbar border-b border-slate-800">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveTab(lang.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === lang.id
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-200"
                }`}
            >
              {lang.label}
              {activeTab === lang.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Editor Body */}
        <div className="p-6 relative group">
          <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
              {languages.find(l => l.id === activeTab)?.label}
            </span>
          </div>
          <pre className="text-sm font-mono leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>

        {/* Status Bar */}
        <div className="bg-[#252525] px-4 py-2 flex items-center gap-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">
              Ready to copy
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <CopyButton textToCopy={codeSnippets[activeTab]} className="text-slate-400 hover:text-white" />
            <Code2 className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>
      </div>

      <h2 className="font-['Outfit'] text-3xl font-bold mb-4 mt-8 border-b border-slate-200 pb-2 text-black">
        Provider Performance Metrics
      </h2>
      <p className="text-slate-600 mb-4">
        The platform tracks key provider performance metrics including:
      </p>
      <ul className="space-y-1 mb-6 text-slate-600 list-disc list-inside ml-2">
        <li>total transactions</li>
        <li>success rate</li>
        <li>failure rate</li>
        <li>average latency</li>
      </ul>
      <p className="text-slate-600 mb-12">
        These metrics will be used in future versions to power{" "}
        <strong>automatic routing decisions</strong> and smart failover mechanisms.
      </p>

      {/* Navigation Footer */}
      <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
        <Link
          to="/docs/authentication"
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
              Authentication
            </span>
          </div>
        </Link>
        <Link
          to="/docs/initiate-payment"
          className="flex items-center justify-end gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              Initiate Payment
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

export default Installation;
