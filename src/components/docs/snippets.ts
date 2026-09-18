import { API_BASE_URL } from "./ApiReference";
import type { CodeSnippet } from "./CodeBlock";

type RequestSpec = {
  method: "GET" | "POST";
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, string>;
};

const INDENT = "  ";

function indent(text: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line, index) => (index === 0 ? line : pad + line))
    .join("\n");
}

function toPhp(value: unknown, depth = 0): string {
  if (value !== null && typeof value === "object") {
    const pad = INDENT.repeat(depth + 1);
    const lines = Object.entries(value as Record<string, unknown>).map(
      ([key, item]) =>
        `${pad}${JSON.stringify(key)} => ${toPhp(item, depth + 1)},`,
    );
    return `[\n${lines.join("\n")}\n${INDENT.repeat(depth)}]`;
  }
  return JSON.stringify(value);
}

function toRuby(value: unknown, depth = 0): string {
  if (value !== null && typeof value === "object") {
    const pad = INDENT.repeat(depth + 1);
    const lines = Object.entries(value as Record<string, unknown>).map(
      ([key, item]) =>
        `${pad}${JSON.stringify(key)} => ${toRuby(item, depth + 1)},`,
    );
    return `{\n${lines.join("\n")}\n${INDENT.repeat(depth)}}`;
  }
  return JSON.stringify(value);
}

/**
 * Builds the same request in every supported language from one definition,
 * so the examples across the docs cannot drift apart.
 */
export function requestSnippets(spec: RequestSpec): CodeSnippet[] {
  const { method, path, body, query } = spec;
  const baseUrl = `${API_BASE_URL}${path}`;
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  const url = `${baseUrl}${queryString}`;
  const json = body ? JSON.stringify(body, null, 2) : "";
  const compactJson = body ? JSON.stringify(body) : "";
  const hasBody = method === "POST" && body !== undefined;

  const curl = [
    `curl --request ${method} '${url}' \\`,
    `  --header 'Client-Secret-Key: synch_sk_sandbox_your_key_here'${hasBody ? " \\" : ""}`,
    ...(hasBody
      ? [
          "  --header 'Content-Type: application/json' \\",
          `  --data-raw '${json}'`,
        ]
      : []),
  ].join("\n");

  const javascript = [
    `const response = await fetch("${url}", {`,
    `  method: "${method}",`,
    "  headers: {",
    '    "Client-Secret-Key": process.env.SYNCHGATE_SECRET_KEY,',
    ...(hasBody ? ['    "Content-Type": "application/json",'] : []),
    "  },",
    ...(hasBody ? [`  body: JSON.stringify(${indent(json, 2)}),`] : []),
    "});",
    "",
    "const result = await response.json();",
    "console.log(response.status, result);",
  ].join("\n");

  const python = [
    "import os",
    "import requests",
    "",
    `response = requests.${method.toLowerCase()}(`,
    `    "${baseUrl}",`,
    "    headers={",
    '        "Client-Secret-Key": os.environ["SYNCHGATE_SECRET_KEY"],',
    ...(hasBody ? ['        "Content-Type": "application/json",'] : []),
    "    },",
    ...(query
      ? [`    params=${indent(JSON.stringify(query, null, 4), 4)},`]
      : []),
    ...(hasBody
      ? [`    json=${indent(JSON.stringify(body, null, 4), 4)},`]
      : []),
    "    timeout=60,",
    ")",
    "",
    "print(response.status_code, response.json())",
  ].join("\n");

  const php = [
    "<?php",
    "$curl = curl_init();",
    "",
    "curl_setopt_array($curl, [",
    `  CURLOPT_URL => "${url}",`,
    "  CURLOPT_RETURNTRANSFER => true,",
    ...(hasBody ? ["  CURLOPT_POST => true,"] : []),
    "  CURLOPT_TIMEOUT => 60,",
    "  CURLOPT_HTTPHEADER => [",
    '    "Client-Secret-Key: " . getenv("SYNCHGATE_SECRET_KEY"),',
    ...(hasBody ? ['    "Content-Type: application/json",'] : []),
    "  ],",
    ...(hasBody
      ? [`  CURLOPT_POSTFIELDS => json_encode(${indent(toPhp(body, 1), 0)}),`]
      : []),
    "]);",
    "",
    "$response = curl_exec($curl);",
    "curl_close($curl);",
    "echo $response;",
  ].join("\n");

  const ruby = [
    'require "net/http"',
    'require "json"',
    "",
    `uri = URI("${url}")`,
    `request = Net::HTTP::${method === "GET" ? "Get" : "Post"}.new(uri${hasBody ? ', "Content-Type" => "application/json"' : ""})`,
    'request["Client-Secret-Key"] = ENV["SYNCHGATE_SECRET_KEY"]',
    ...(hasBody ? [`request.body = ${toRuby(body)}.to_json`] : []),
    "",
    "response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|",
    "  http.request(request)",
    "end",
    "",
    "puts response.body",
  ].join("\n");

  const java = [
    "import java.net.URI;",
    "import java.net.http.HttpClient;",
    "import java.net.http.HttpRequest;",
    "import java.net.http.HttpResponse;",
    "",
    "HttpClient client = HttpClient.newHttpClient();",
    "HttpRequest request = HttpRequest.newBuilder()",
    `    .uri(URI.create("${url}"))`,
    '    .header("Client-Secret-Key", System.getenv("SYNCHGATE_SECRET_KEY"))',
    ...(hasBody ? ['    .header("Content-Type", "application/json")'] : []),
    hasBody
      ? `    .POST(HttpRequest.BodyPublishers.ofString(${JSON.stringify(compactJson)}))`
      : "    .GET()",
    "    .build();",
    "",
    "HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());",
    "System.out.println(response.body());",
  ].join("\n");

  return [
    { id: "curl", label: "cURL", code: curl },
    { id: "javascript", label: "JavaScript", code: javascript },
    { id: "python", label: "Python", code: python },
    { id: "php", label: "PHP", code: php },
    { id: "ruby", label: "Ruby", code: ruby },
    { id: "java", label: "Java", code: java },
  ];
}
