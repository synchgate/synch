import { useState } from "react";
import { CopyButton } from "../ui/CopyButton";

export function CodeBlock({
  code,
  title,
  className = "mb-8",
}: {
  code: string;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-slate-900 shadow-inner overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between bg-[#252525] px-4 py-2 border-b border-slate-800">
          <span className="text-xs font-mono text-slate-400">{title}</span>
          <CopyButton textToCopy={code} />
        </div>
      )}
      <div className="relative group">
        {!title && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton textToCopy={code} />
          </div>
        )}
        <pre className="p-6 text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export type CodeSnippet = { id: string; label: string; code: string };

export function CodeTabs({
  snippets,
  className = "mb-8",
}: {
  snippets: CodeSnippet[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(snippets[0].id);
  const active = snippets.find((s) => s.id === activeId) ?? snippets[0];

  return (
    <div
      className={`bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${className}`}
    >
      <div
        role="tablist"
        className="flex items-center gap-1 bg-[#252525] px-4 pt-2 overflow-x-auto no-scrollbar border-b border-slate-800"
      >
        {snippets.map((snippet) => (
          <button
            key={snippet.id}
            type="button"
            role="tab"
            aria-selected={snippet.id === active.id}
            onClick={() => setActiveId(snippet.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap ${
              snippet.id === active.id
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {snippet.label}
            {snippet.id === active.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}
          </button>
        ))}
        <div className="ml-auto pb-1">
          <CopyButton textToCopy={active.code} />
        </div>
      </div>
      <pre className="p-6 text-sm font-mono leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
        <code>{active.code}</code>
      </pre>
    </div>
  );
}
