import { motion } from "framer-motion";
import {
  Check,
  Zap,
  LineChart,
  Lock,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Globe,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      id: "analytics",
      name: "Advanced Analytics",
      price: "15,000",
      description:
        "Perfect for growing merchants who need deep insights into transaction performance.",
      features: [
        "Advanced Trends & Forecasting",
        "Payment Gateway Performance Metrics",
        "Real-time Transaction Monitoring",
        "Custom API Performance Reports",
        "Email Support",
      ],
      isAvailable: true,
      tag: "Popular",
      icon: LineChart,
      color: "blue",
    },
    {
      id: "professional",
      name: "Professional Mode",
      price: "45,000",
      description:
        "Scale your business with higher limits and specialized routing tools.",
      features: [
        "Dynamic Routing Engine",
        "Priority Settlement Mode",
        "Multi-Merchant Management",
        "Dedicated Account Manager",
        "24/7 Phone Support",
      ],
      isAvailable: false,
      tag: "Coming Soon",
      icon: Zap,
      color: "indigo",
    },
    {
      id: "enterprise",
      name: "Enterprise Custom",
      price: "120,000+",
      description:
        "Bespoke infrastructure tailored for high-volume financial institutions.",
      features: [
        "Custom Gateway Integrations",
        "On-premise Deployment Options",
        "White-label Dashboard",
        "Unlimited API Routes",
        "SLA Guarantee & Legal Concierge",
      ],
      isAvailable: false,
      tag: "Coming Soon",
      icon: Globe,
      color: "slate",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-12">
        <Link
          to="/dashboard/billings"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Billing
        </Link>
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100"
          >
            <Sparkles className="w-3 h-3" />
            Pricing Plans
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Level up your experience
          </h1>
          <p className="text-lg text-slate-600">
            Choose the plan that fits your business stage. Start with
            professional analytics today.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl border p-8 transition-all duration-500 overflow-hidden ${
              plan.isAvailable
                ? "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-300 ring-2 ring-transparent hover:ring-blue-100"
                : "bg-slate-50/50 border-slate-200 opacity-80 grayscale-[0.5]"
            }`}
          >
            {!plan.isAvailable && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200/80 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-white/50 shadow-sm">
                  <Lock className="w-3 h-3" />
                  {plan.tag}
                </div>
              </div>
            )}

            {plan.isAvailable && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider border border-emerald-200 shadow-sm">
                  <TrendingUp className="w-3 h-3" />
                  {plan.tag}
                </div>
              </div>
            )}

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${
                plan.color === "blue"
                  ? "bg-blue-100 text-blue-600"
                  : plan.color === "indigo"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-200 text-slate-600"
              }`}
            >
              <plan.icon className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {plan.name}
            </h3>
            <p className="text-sm text-slate-500 mb-8 min-h-[40px] leading-relaxed">
              {plan.description}
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-slate-900">
                ₦{plan.price}
              </span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.isAvailable
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3px]" />
                  </div>
                  <span
                    className={`text-sm ${plan.isAvailable ? "text-slate-600 font-medium" : "text-slate-400"}`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={!plan.isAvailable}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                plan.isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {plan.isAvailable ? "Subscribe Now" : "Request Early Access"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Additional Context Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mb-20">
        {/* Money Lost / Savings Potential */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-br from-rose-50 to-white border border-rose-100 rounded-3xl p-8 flex gap-6 items-start"
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-2">
              Potential Loss Identified
            </h4>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black text-rose-700">
                ₦245,600.00
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on your transaction data from the last 30 days, you missed
              out on approximately{" "}
              <span className="font-bold text-slate-900">₦245,600</span> in
              optimized gateway routing. Subscribing to{" "}
              <span className="font-bold text-blue-600">
                Advanced Analytics
              </span>{" "}
              could have prevented this by automatically identifying performance
              bottlenecks.
            </p>
          </div>
        </motion.div>

        {/* Current Payment Method */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                Preferred Payment Method
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 leading-none">
                    Visa ending in 8842
                  </p>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold">
                    Expires 12/2026
                  </p>
                </div>
              </div>
            </div>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase tracking-tighter border border-emerald-100">
              Active
            </div>
          </div>
          <div className="flex gap-4 border-t border-slate-100 pt-6 mt-auto">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Update Method
            </button>
            <div className="w-px h-4 bg-slate-200 my-auto"></div>
            <button className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
              Manage Subscriptions
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center"
      >
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale filter hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-8"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Stripe_logo%2C_revised_2016.png"
            alt="Stripe"
            className="h-6"
          />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-12 mb-4">
          Trusted by industry leaders globally
        </p>
      </motion.div>
    </div>
  );
};

export default Pricing;
