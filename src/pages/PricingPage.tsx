import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Clock, LineChart, Loader2, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  formatNaira,
  GROWTH_PLAN,
  PLATFORM_FEE_NGN,
  STARTER_PLAN,
} from "../config/pricing";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";

type PlanUI = {
  key: "starter" | "growth";
  name: string;
  price: string;
  unit: string;
  volume: string;
  description: string;
  features: string[];
  comingSoon?: string[];
  tag: string;
  icon: typeof LineChart;
  color: "emerald" | "blue";
  ctaText: string;
};

const PLAN_UI: PlanUI[] = [
  {
    key: "starter",
    name: STARTER_PLAN.name,
    price: "Free",
    unit: "",
    volume: `${STARTER_PLAN.transactions} successful transactions a month`,
    description: "Everything you need to start collecting and sending money.",
    features: [
      "Payments, bank transfers and account lookup",
      "Smart Route provider selection",
      "Sandbox and live API keys",
      "Transaction logs and dashboard",
    ],
    tag: "Free",
    icon: LineChart,
    color: "emerald",
    ctaText: "Get started",
  },
  {
    key: "growth",
    name: GROWTH_PLAN.name,
    price: formatNaira(GROWTH_PLAN.priceNgn),
    unit: "/ month",
    volume: `${GROWTH_PLAN.transactions.toLocaleString("en-NG")} successful transactions a month`,
    description: "For businesses processing higher volume.",
    features: [
      "Everything in Starter, plus:",
      `${GROWTH_PLAN.transactions.toLocaleString("en-NG")} successful transactions a month`,
    ],
    comingSoon: [
      "Advanced analytics dashboard",
      "Success rate by gateway, bank and time",
      "Failure reason breakdown",
      "Auto-retry of failed transactions",
    ],
    tag: "Higher volume",
    icon: Zap,
    color: "blue",
    ctaText: "Upgrade to Growth",
  },
];

const BILLING_NOTES = [
  `Starter is free. Growth is ${formatNaira(GROWTH_PLAN.priceNgn)} a month.`,
  `A flat ${formatNaira(PLATFORM_FEE_NGN)} platform fee applies to each successful live transaction, on top of the fees your payment provider charges you.`,
  "The sandbox is free and has no platform fee.",
  `Starter includes ${STARTER_PLAN.transactions} successful transactions a month and Growth includes ${GROWTH_PLAN.transactions.toLocaleString("en-NG")}.`,
];

type Plan = { id: string; tier: string };

const PricingPage = () => {
  const { isAuthenticated } = useAuth();

  // The plans endpoint needs a signed-in user, so only ask for it once there is one
  const { data: plansData } = useQuery<Plan[]>({
    queryKey: ["billing-plans"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get("/billing/plans");
      return res.data?.data ?? res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const growthPlanId =
    (Array.isArray(plansData) ? plansData : []).find(
      (plan) => plan.tier === "growth",
    )?.id ?? null;

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await api.post("/billing/subscriptions/", {
        plan_id: planId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      const paymentUrl =
        data?.data?.cleaned_data?.payment_url ||
        data?.payment_url ||
        data?.authorization_url ||
        data?.checkout_url ||
        data?.url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
  });

  const handleGrowthClick = () => {
    if (!growthPlanId) return;
    subscribeMutation.mutate(growthPlanId);
  };

  const growthUnavailable = isAuthenticated && plansData && !growthPlanId;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100"
            >
              <Sparkles className="w-3 h-3" />
              Transparent Pricing
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Start free.{" "}
              <span className="text-blue-600">Scale when ready.</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              A monthly plan plus a small flat fee on each successful live
              transaction. Everything is listed on this page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {PLAN_UI.map((plan, index) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden flex flex-col bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-slate-300"
              >
                <div className="absolute top-6 right-6 z-20">
                  <div
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${
                      plan.color === "emerald"
                        ? "bg-emerald-500 text-white shadow-emerald-100"
                        : "bg-blue-600 text-white shadow-blue-100"
                    }`}
                  >
                    {plan.tag}
                  </div>
                </div>

                <div
                  className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 shadow-sm ${
                    plan.color === "emerald"
                      ? "bg-emerald-600 text-white shadow-emerald-200"
                      : "bg-blue-600 text-white shadow-blue-200"
                  }`}
                >
                  <plan.icon className="w-8 h-8" />
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-8 min-h-[50px] leading-relaxed font-medium">
                  {plan.description}
                </p>

                <div className="flex flex-col gap-1 mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-slate-900 tracking-tighter text-5xl">
                      {plan.price}
                    </span>
                    {plan.unit && (
                      <span className="text-slate-500 font-bold text-lg">
                        {plan.unit}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-bold text-sm tracking-wide">
                    {plan.volume}
                  </span>
                </div>

                <div className="space-y-5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.color === "emerald"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Check className="w-3 h-4 stroke-[4px]" />
                      </div>
                      <span
                        className={`text-[15px] leading-tight ${
                          feature.includes("Everything in")
                            ? "font-black text-slate-900 underline decoration-blue-500/30 underline-offset-4"
                            : "text-slate-700 font-bold"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.comingSoon && (
                  <div className="mb-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> Coming soon
                    </p>
                    <ul className="space-y-2">
                      {plan.comingSoon.map((item) => (
                        <li
                          key={item}
                          className="text-sm font-medium text-slate-500"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.key === "starter" ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/auth/signup"
                      className="block w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200"
                    >
                      {plan.ctaText}
                    </Link>
                  </motion.div>
                ) : isAuthenticated ? (
                  <motion.div
                    whileHover={{
                      scale: subscribeMutation.isPending ? 1 : 1.02,
                    }}
                    whileTap={{
                      scale: subscribeMutation.isPending ? 1 : 0.98,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleGrowthClick}
                      disabled={subscribeMutation.isPending || !growthPlanId}
                      className="w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {subscribeMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        plan.ctaText
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/auth/signup"
                      className="block w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
                    >
                      Create account to upgrade
                    </Link>
                  </motion.div>
                )}

                {plan.key === "growth" && subscribeMutation.isError && (
                  <p className="text-xs text-red-500 text-center mt-3 font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}
                {plan.key === "growth" && growthUnavailable && (
                  <p className="text-xs text-red-500 text-center mt-3 font-medium">
                    This plan is not available right now. Please contact us.
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
