import { useAuth } from "../contexts/AuthContext";

export type Environment = "live" | "sandbox";

/** Which data the dashboard should show: the Test/Live switch in the header. */
export function useEnvironment(): Environment {
  const { merchantMode } = useAuth();
  return merchantMode === "live" ? "live" : "sandbox";
}

/** API responses come wrapped as { status, message, data, meta }. */
export function unwrap<T = any>(response: { data?: any } | undefined): T {
  const body = response?.data;
  return (
    body && typeof body === "object" && "data" in body ? body.data : body
  ) as T;
}

export const formatNaira = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export const formatAmount = (value: number | string, currency = "NGN") => {
  const amount = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: (currency || "NGN").toUpperCase(),
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};

export const formatNumber = (value: number | null | undefined) =>
  Number(value ?? 0).toLocaleString("en-NG");

export const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
};

export const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const timeAgo = (value?: string | null) => {
  if (!value) return "—";
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

export const PROVIDER_NAMES = ["paystack", "flutterwave", "nomba"] as const;

export const titleCase = (value?: string | null) =>
  value
    ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ")
    : "—";
