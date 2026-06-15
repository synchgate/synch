import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, LineChart, Loader2, Sparkles, Zap } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

const PLAN_UI = [
  {
    key: "starter",
    name: "Starter",
    price: "Free",
    unit: "200 Monthly Successful Transactions",
    volumeUnit: "",
    description: "Perfect for getting started with payments.",
    features: [
      "Basic payment routing",
      "Transaction logs",
      "Standard API access",
      "Basic dashboard (success vs failed)",
    ],
    tag: "Free Connection",
    icon: LineChart,
    color: "emerald",
    ctaText: "Get Started",
  },
  {
    key: "growth",
    name: "Growth",
    price: "5000",
    unit: "/ month",
    volumeUnit: "3000 Monthly Successful Transactions",
    description: "For businesses that want visibility into their payments.",
    features: [
      "Everything in Starter, plus:",
      "Advanced analytics dashboard",
      "Success rate by gateway, bank & time",
      "Failure reason breakdown",
      "Transaction trends & insights",
      "Auto-retry failed transactions",
      "Revenue loss insights (see failed payment value)",
      "Customer payment behavior insights",
    ],
    tag: "Deep Visibility",
    icon: Zap,
    color: "blue",
    ctaText: "Upgrade to Growth",
  },
];

const PricingPage = () => {
  const { data: plansData } = useQuery({
    queryKey: ["billing-plans"],
    queryFn: async () => {
      const res = await api.get("/billing/plans");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const growthPlanId = plansData?.[1]?.id ?? null;

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      console.log("Subscribing with payload:", { plan_id: planId });
      const res = await api.post("/billing/subscriptions/", { plan_id: planId });
      console.log("Subscription response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      const paymentUrl =
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      <Navbar />

      {/* Main Content */}
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
              Everything you need to{" "}
              <span className="text-blue-600">scale.</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Choose the right plan for your business needs. No hidden fees,
              just pure orchestration.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto">
            {PLAN_UI.map((plan, index) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden flex flex-col bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-slate-300"
              >
                {/* Badge */}
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

                {/* Icon */}
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
                    <span
                      className={`font-black text-slate-900 tracking-tighter ${plan.key === "starter" ? "text-3xl" : "text-5xl"}`}
                    >
                      {plan.key !== "starter" && "₦"}
                      {plan.price}
                    </span>
                    {plan.key !== "starter" && (
                      <span className="text-slate-500 font-bold text-lg">
                        {plan.unit}
                      </span>
                    )}
                  </div>
                  {plan.key === "starter" && (
                    <span className="text-slate-500 font-bold text-sm tracking-wide lowercase">
                      {plan.unit}
                    </span>
                  )}
                  {plan.volumeUnit && (
                    <span className="text-slate-500 font-bold text-sm tracking-wide">
                      {plan.volumeUnit}
                    </span>
                  )}
                </div>

                <div className="space-y-5 mb-12 flex-1">
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

                {plan.key === "starter" ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <a
                      href="/auth/signup"
                      className="block w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200"
                    >
                      {plan.ctaText}
                    </a>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: subscribeMutation.isPending ? 1 : 1.02 }} whileTap={{ scale: subscribeMutation.isPending ? 1 : 0.98 }}>
                    <button
                      onClick={handleGrowthClick}
                      disabled={subscribeMutation.isPending}
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
                )}

                {subscribeMutation.isError && plan.key === "growth" && (
                  <p className="text-xs text-red-500 text-center mt-3 font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
