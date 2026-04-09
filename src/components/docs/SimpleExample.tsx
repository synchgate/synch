import { useState } from "react";
import { Code2 } from "lucide-react";
import { CopyButton } from "../ui/CopyButton";

export function SimpleExample() {
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
        "{\\"provider\\":\\"paystack\\",\\"amount\\":5000,\\"email\\":\\"user@example.com\\", \\"reference\\":\\"kskfksjf\\", \\"callback_url\\":\\"https://your-domain.com/payment-success\\", \\"currency\\":\\"NGN\\"}"
    ))
    .build();

client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println);`,
  };

  return (
    <>
      <h2 className="font-['Outfit'] text-3xl font-bold mb-6 mt-12 border-b border-slate-200 pb-2 text-black">
        Simple Example
      </h2>

      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Get started quickly by implementing our API in your preferred language.
        Select a tab below to see the implementation details.
      </p>

      {/* Multilingual Code Editor */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
        {/* Tab Header */}
        <div className="flex items-center gap-1 bg-[#252525] px-4 pt-2 overflow-x-auto no-scrollbar border-b border-slate-800">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveTab(lang.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap ${
                activeTab === lang.id
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
              {languages.find((l) => l.id === activeTab)?.label}
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
            <CopyButton
              textToCopy={codeSnippets[activeTab]}
              className="text-slate-400 hover:text-white"
            />
            <Code2 className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>
      </div>
    </>
  );
}
