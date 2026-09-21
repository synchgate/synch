/**
 * Public pricing facts, shared by the homepage, pricing page, FAQ and wallet so they cannot drift
 * apart. Keep in sync with the wallet settings in the backend (WALLET_DEFAULT_FEE_PERCENT,
 * WALLET_MIN_TOPUP, WALLET_TOPUP_BONUS_PERCENT).
 */

/**
 * The platform fee taken on each successful live payment or payout, as a percentage of its amount
 * (0.1 means 0.1%, so ₦1 on ₦1,000). Sandbox is free.
 */
export const PLATFORM_FEE_PERCENT = 0.1;

/** The least a wallet can be topped up with. */
export const MIN_TOPUP_NGN = 5000;

/** Extra credited on every top-up, as a percentage of what was paid. Spendable, not refundable. */
export const TOPUP_BONUS_PERCENT = 10;

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

/** A percentage without a needless trailing zero: 0.1 -> "0.1%", 1 -> "1%". */
export const formatPercent = (percent: number) =>
  `${Number(percent.toFixed(3))}%`;

/** The fee on a transaction of `amount`, to the nearest kobo. */
export function feeFor(amount: number, percent = PLATFORM_FEE_PERCENT) {
  return Math.round(((amount * percent) / 100) * 100) / 100;
}

/** What a top-up of `amount` actually credits, and how much in transactions it pays the fee on. */
export function topUpBreakdown(
  amount: number,
  percent = PLATFORM_FEE_PERCENT,
  bonusPercent = TOPUP_BONUS_PERCENT,
) {
  const bonus = Math.round(amount * bonusPercent) / 100;
  const credit = amount + bonus;
  return {
    bonus,
    credit,
    volume: percent > 0 ? Math.floor((credit * 100) / percent) : 0,
  };
}
