/**
 * Public pricing facts, shared by the homepage, pricing page and FAQ so they cannot drift apart.
 * Keep in sync with the billing plans in the backend.
 */
export const STARTER_PLAN = {
  name: "Starter",
  transactions: 200,
};

export const GROWTH_PLAN = {
  name: "Growth",
  priceNgn: 5000,
  transactions: 3000,
};

/** Flat platform fee charged on each successful live transaction. Sandbox is free. */
export const PLATFORM_FEE_NGN = 20;

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;
