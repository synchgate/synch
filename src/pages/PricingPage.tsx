import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  feeFor,
  formatNaira,
  formatPercent,
  MIN_TOPUP_NGN,
  PLATFORM_FEE_PERCENT,
  TOPUP_BONUS_PERCENT,
  topUpBreakdown,
} from "../config/pricing";
import { useAuth } from "../contexts/AuthContext";

const FEE = formatPercent(PLATFORM_FEE_PERCENT);

const STEPS = [
  {
    title: "Add funds",
    text: `Top up your wallet from ${formatNaira(MIN_TOPUP_NGN)}. Every top-up comes with ${TOPUP_BONUS_PERCENT}% extra.`,
  },
  {
    title: "Go live",
    text: "Collect payments and send payouts through the providers you already use.",
  },
  {
    title: "Pay only on success",
    text: `${FEE} of the amount is taken when a payment or payout succeeds. Nothing is taken when one fails.`,
  },
];

const INCLUDED = [
  "Payments, bank transfers and account lookup",
  "Smart Route provider selection",
  "Sandbox and live API keys",
  "Transaction logs and dashboard",
  "Webhooks for payouts",
  "Unused cash refunded on request",
];

const EXAMPLE_AMOUNTS = [1000, 50000, 1000000];

const BILLING_NOTES = [
  `The fee is ${FEE} of the amount of each successful live payment and each successful payout, on top of the fees your payment provider charges you. It scales with the transaction: ${formatNaira(feeFor(1000))} on ${formatNaira(1000)}, ${formatNaira(feeFor(100000))} on ${formatNaira(100000)}.`,
  "Failed and abandoned transactions cost nothing. The fee is set aside when a transaction starts and given back if it doesn't succeed.",
  "If a bank sends a payout back, the fee for it is refunded.",
  `The ${TOPUP_BONUS_PERCENT}% top-up bonus is spent after your own cash and can't be refunded. Cash you haven't used can be paid back to your bank account.`,
  "There is no monthly fee and no contract. The sandbox is free and has no fee.",
  "Your wallet only pays for SynchGate. Your customers' money goes straight to your own payment provider account and never passes through it.",
];

const QUICK_AMOUNTS = [5000, 10000, 50000];

const PricingPage = () => {
  const { isAuthenticated } = useAuth();
  const [amount, setAmount] = useState(10000);
  const example = topUpBreakdown(amount);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100"
            >
              <Sparkles className="w-3 h-3" />
              Transparent Pricing
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Pay only when <span className="text-blue-600">money moves.</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              No monthly fee. Fund a wallet, and {FEE} of each successful live
              payment or payout is taken as the fee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-black text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Wallet className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Pay as you go
              </h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-slate-900">
                  {FEE}
                </span>
                <span className="text-lg font-bold text-slate-500">
                  of each successful transaction
                </span>
              </div>

              <dl className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 divide-y divide-slate-200 text-sm">
                {EXAMPLE_AMOUNTS.map((value) => (
                  <div key={value} className="flex justify-between px-4 py-3">
                    <dt className="text-slate-600">
                      A {formatNaira(value)} transaction
                    </dt>
                    <dd className="font-bold text-slate-900">
                      {formatNaira(feeFor(value))} fee
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-8 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Check className="h-3 w-4 stroke-[4px]" />
                    </span>
                    <span className="text-[15px] font-bold leading-tight text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-10"
              >
                <Link
                  to={isAuthenticated ? "/dashboard/billing" : "/auth/signup"}
                  className="flex w-full items-center justify-center gap-2 rounded-3xl bg-blue-600 py-5 text-[17px] font-black text-white shadow-xl shadow-blue-200 transition-all duration-300 hover:bg-blue-700"
                >
                  {isAuthenticated ? "Add funds" : "Get started"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-10">
              <h2 className="text-xl font-black text-slate-900">
                What a top-up buys
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose an amount to see what lands in your wallet.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmount(quick)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
                      amount === quick
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {formatNaira(quick)}
                  </button>
                ))}
              </div>

              <dl className="mt-8 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">You pay</dt>
                  <dd className="font-bold text-slate-900">
                    {formatNaira(amount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Bonus ({TOPUP_BONUS_PERCENT}%)
                  </dt>
                  <dd className="font-bold text-emerald-600">
                    +{formatNaira(example.bonus)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <dt className="text-slate-500">Added to your wallet</dt>
                  <dd className="font-black text-slate-900">
                    {formatNaira(example.credit)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 rounded-2xl bg-white p-5 text-center border border-slate-200">
                <p className="text-4xl font-black text-blue-600">
                  {formatNaira(example.volume)}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  of successful transactions covered at {FEE}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-slate-900">
              How billing works
            </h2>
            <ul className="space-y-3">
              {BILLING_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
