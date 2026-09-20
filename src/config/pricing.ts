/**
 * Public pricing facts, shared by the homepage, pricing page, FAQ and wallet so they cannot drift
 * apart. Keep in sync with the wallet settings in the backend (WALLET_DEFAULT_FEE, WALLET_MIN_TOPUP,
 * WALLET_TOPUP_BONUS_PERCENT).
 */

/** Flat platform fee taken for each successful live payment or payout. Sandbox is free. */
export const PLATFORM_FEE_NGN = 20;

/** The least a wallet can be topped up with. */
export const MIN_TOPUP_NGN = 5000;

/** Extra credited on every top-up, as a percentage of what was paid. Spendable, not refundable. */
export const TOPUP_BONUS_PERCENT = 10;

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

/** What a top-up of `amount` actually credits, and what it buys. */
export function topUpBreakdown(
  amount: number,
  fee = PLATFORM_FEE_NGN,
  bonusPercent = TOPUP_BONUS_PERCENT,
) {
  const bonus = Math.round(amount * bonusPercent) / 100;
  const credit = amount + bonus;
  return {
    bonus,
    credit,
    transactions: fee > 0 ? Math.floor(credit / fee) : 0,
  };
}
