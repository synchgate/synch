import { motion } from "framer-motion";
import { Check, Info, LineChart, Sparkles, Star, Zap } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PricingPage = () => {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      unit: "Only pay Per successful transaction",
      description: "Perfect for getting started with payments.",
      features: [
        "Basic payment routing",
        "Transaction logs",
        "Standard API access",
        "Basic dashboard (success vs failed)",
      ],
      isAvailable: true,
      tag: "Free Connection",
      icon: LineChart,
      color: "emerald",
      ctaText: "Get Started",
    },
    {
      id: "growth",
      name: "Growth",
      price: "Coming Soon",
      unit: "/ month",
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
      isAvailable: false,
      tag: "Deep Visibility",
      icon: Zap,
      color: "blue",
      ctaText: "Upgrade to Growth",
    },
    {
      id: "pro",
      name: "Pro",
      price: "Coming Soon",
      unit: "/ month",
      description:
        "For businesses that want to increase revenue automatically.",
      features: [
        "Everything in Growth, plus:",
        "Intelligent routing insights",
        "Dynamic auto-routing (switch gateways automatically)",
        "“What-if” revenue simulations",
        "Real-time gateway health monitoring",
        "Downtime & failure alerts (Slack, Email, Webhook)",
        "Performance optimization recommendations",
      ],
      isAvailable: false,
      tag: "Most Popular",
      isPopular: true,
      icon: Star,
      color: "indigo",
      ctaText: "Start Optimizing Revenue",
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden flex flex-col ${plan.isPopular
                  ? "bg-white border-blue-200 shadow-2xl shadow-blue-200/50 ring-4 ring-blue-50"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-slate-300"
                  }`}
              >
                {/* Popular Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${plan.isPopular
                      ? "bg-indigo-600 text-white shadow-indigo-200"
                      : plan.color === "emerald"
                        ? "bg-emerald-500 text-white shadow-emerald-100"
                        : "bg-blue-600 text-white shadow-blue-100"
                      }`}
                  >
                    {plan.id === "pro" && (
                      <Star className="w-3 h-3 fill-current" />
                    )}
                    {plan.tag}
                  </div>
                </div>

                {/* Plan Icon */}
                <div
                  className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 shadow-sm ${plan.color === "emerald"
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : plan.color === "blue"
                      ? "bg-blue-600 text-white shadow-blue-200"
                      : "bg-indigo-600 text-white shadow-indigo-200"
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

                <div className={`flex flex-col gap-1 mb-10`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-black text-slate-900 tracking-tighter ${plan.id === "starter" ? "text-3xl" : plan.price === "Coming Soon" ? "text-2xl" : "text-5xl"}`}>
                      {(plan.id !== "starter" && plan.price !== "Coming Soon") && "₦"}{plan.price}
                    </span>
                    {(plan.id !== "starter" && plan.price !== "Coming Soon") && (
                      <span className="text-slate-500 font-bold text-lg">
                        {plan.unit}
                      </span>
                    )}
                  </div>
                  {plan.id === "starter" && (
                    <span className="text-slate-500 font-bold text-sm tracking-wide lowercase">
                      {plan.unit}
                    </span>
                  )}
                  {plan.id === "starter" && (
                    <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
                        Invoices for accumulated transaction bills are sent at
                        the end of every month.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.color === "emerald"
                          ? "bg-emerald-100 text-emerald-600"
                          : plan.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-indigo-100 text-indigo-600"
                          }`}
                      >
                        <Check className="w-3 h-4 stroke-[4px]" />
                      </div>
                      <span
                        className={`text-[15px] leading-tight ${feature.includes("Everything in")
                          ? "font-black text-slate-900 underline decoration-blue-500/30 underline-offset-4"
                          : "text-slate-700 font-bold"
                          }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.isAvailable ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a
                      href="/auth/signup"
                      className={`block w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 ${plan.isPopular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                        : plan.color === "emerald"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
                        }`}
                    >
                      {plan.ctaText}
                    </a>
                  </motion.div>
                ) : (
                  <div className="block w-full py-5 rounded-3xl font-black text-center text-[17px] bg-slate-100 text-slate-400 cursor-not-allowed select-none pointer-events-none">
                    {plan.ctaText}
                  </div>
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
