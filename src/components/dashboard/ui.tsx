import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { titleCase } from "../../lib/dashboard";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-slate-600 text-sm sm:text-base">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className = "",
  padded = true,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-semibold text-slate-900 text-sm sm:text-base">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? "p-5 sm:p-6" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-medium">{label}</span>
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-24 rounded bg-slate-100 animate-pulse" />
      ) : (
        <span className="font-['Outfit'] text-2xl font-bold text-slate-900">
          {value}
        </span>
      )}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <p className="font-semibold text-slate-900 mb-1">{title}</p>
      {children && (
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          {children}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500 text-sm">
      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      {label}
    </div>
  );
}

const STATUS_STYLES: Record<string, { className: string; Icon: typeof Clock }> =
  {
    success: {
      className: "bg-emerald-100 text-emerald-700",
      Icon: CheckCircle2,
    },
    failed: { className: "bg-red-100 text-red-700", Icon: XCircle },
    abandoned: { className: "bg-slate-100 text-slate-600", Icon: XCircle },
    processing: { className: "bg-blue-100 text-blue-700", Icon: Clock },
    pending: { className: "bg-amber-100 text-amber-700", Icon: Clock },
    retrying: { className: "bg-amber-100 text-amber-700", Icon: Clock },
  };

export function StatusBadge({ status }: { status?: string }) {
  const key = (status || "pending").toLowerCase();
  const { className, Icon } = STATUS_STYLES[key] ?? STATUS_STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${className}`}
    >
      <Icon className="w-3 h-3" />
      {titleCase(key)}
    </span>
  );
}

export function TypeBadge({ type }: { type?: string }) {
  const payout = type === "payout";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        payout ? "text-violet-700" : "text-slate-700"
      }`}
    >
      {payout ? (
        <ArrowUpRight className="w-3.5 h-3.5" />
      ) : (
        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
      )}
      {payout ? "Payout" : "Payment"}
    </span>
  );
}

export function EnvironmentBadge({ environment }: { environment: string }) {
  const live = environment === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        live ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {live ? "Live" : "Test"}
    </span>
  );
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
  noun = "transactions",
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  noun?: string;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between gap-4">
      <span className="text-xs text-slate-500">
        {total === 0
          ? `No ${noun}`
          : `${from}–${to} of ${total.toLocaleString()} ${noun}`}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 hidden sm:block">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 shadow-sm hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 shadow-sm hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            value === option.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
