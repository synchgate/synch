import type { ReactNode } from "react";
import { CopyButton } from "../ui/CopyButton";

export const API_BASE_URL = "https://api.synchgate.com/v1/api";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-300",
  POST: "bg-blue-500/15 text-blue-300",
  PUT: "bg-amber-500/15 text-amber-300",
  DELETE: "bg-rose-500/15 text-rose-300",
};

export function Endpoint({
  method,
  path,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
}) {
  const url = `${API_BASE_URL}${path}`;

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono mb-8 shadow-inner overflow-x-auto border border-white/10 relative group flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${METHOD_STYLES[method]}`}
        >
          {method}
        </span>
        <span className="text-slate-300 whitespace-nowrap">{url}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton textToCopy={url} />
      </div>
    </div>
  );
}

export type Param = {
  name: string;
  type: string;
  required?: boolean;
  description: ReactNode;
};

export function ParamTable({
  params,
  showRequired = true,
}: {
  params: Param[];
  showRequired?: boolean;
}) {
  return (
    <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#242424] text-slate-200 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 font-medium">Field</th>
            <th className="px-6 py-4 font-medium">Type</th>
            {showRequired && (
              <th className="px-6 py-4 font-medium text-center">Required</th>
            )}
            <th className="px-6 py-4 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 bg-[#1e1e1e] text-slate-300">
          {params.map((param) => (
            <tr key={param.name}>
              <td className="px-6 py-4 font-mono text-amber-300 whitespace-nowrap">
                {param.name}
              </td>
              <td className="px-6 py-4 text-blue-300 font-mono whitespace-nowrap">
                {param.type}
              </td>
              {showRequired && (
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {param.required ? (
                    <span className="text-emerald-400">Required</span>
                  ) : (
                    <span className="text-slate-500">Optional</span>
                  )}
                </td>
              )}
              <td className="px-6 py-4">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReferenceTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { key: string; cells: ReactNode[] }[];
}) {
  return (
    <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#242424] text-slate-200 text-xs uppercase tracking-wider">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 bg-[#1e1e1e] text-slate-300">
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td
                  // cells are positional and static, so the column index is a stable key
                  // biome-ignore lint/suspicious/noArrayIndexKey: static table layout
                  key={index}
                  className={`px-6 py-4 ${index === 0 ? "font-mono text-amber-300 whitespace-nowrap" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
