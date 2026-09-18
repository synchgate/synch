import { ArrowLeft, ArrowRight, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function DocPage({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
            {eyebrow}
          </span>
        </div>
      )}
      <h1 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black">
        {title}
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">{children}</p>
    </>
  );
}

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-['Outfit'] text-3xl font-bold mb-4 mt-12 border-b border-slate-200 pb-2 text-black scroll-mt-24"
    >
      {children}
    </h2>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-semibold text-slate-900 text-lg mb-3">{children}</h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-6">{children}</p>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[0.9em] font-mono">
      {children}
    </code>
  );
}

const CALLOUT_STYLES = {
  info: {
    box: "bg-blue-50 border-blue-200 text-blue-900",
    Icon: Info,
  },
  warning: {
    box: "bg-yellow-50 border-yellow-200 text-yellow-800",
    Icon: TriangleAlert,
  },
} as const;

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: keyof typeof CALLOUT_STYLES;
  title: string;
  children: ReactNode;
}) {
  const { box, Icon } = CALLOUT_STYLES[variant];

  return (
    <div className={`border p-4 rounded-xl mb-8 flex gap-4 shadow-sm ${box}`}>
      <Icon className="w-6 h-6 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

type NavLink = { label: string; to: string };

export function PageNav({ prev, next }: { prev?: NavLink; next?: NavLink }) {
  return (
    <div className="grid grid-cols-2 gap-4 items-center py-8 mt-16 border-t border-slate-200">
      {prev ? (
        <Link
          to={prev.to}
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
              {prev.label}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.to}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer min-w-0 justify-end text-right"
        >
          <div className="text-right min-w-0 pl-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider block">
              Next
            </span>
            <span className="font-medium text-blue-600 group-hover:text-blue-500 block truncate">
              {next.label}
            </span>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
