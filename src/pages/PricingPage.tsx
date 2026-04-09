import { motion } from "framer-motion";
import { 
  Check, 
  Zap, 
  LineChart, 
  Lock, 
  Sparkles,
  TrendingUp,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const PricingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const plans = [
    {
      id: "analytics",
      name: "Advanced Analytics",
      price: "15,000",
      description: "Perfect for growing merchants who need deep insights into transaction performance.",
      features: [
        "Advanced Trends & Forecasting",
        "Payment Gateway Performance Metrics",
        "Customer Email Lists",
        "Payment Time Analytics",
        "Real-time Transaction Monitoring",
        "Email Support",
      ],
      isAvailable: true,
      tag: "Popular",
      icon: LineChart,
      color: "blue"
    },
    {
      id: "professional",
      name: "Professional Mode",
      price: "45,000",
      description: "Scale your business with higher limits and specialized routing tools.",
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
      color: "indigo"
    },
    {
      id: "enterprise",
      name: "Enterprise Custom",
      price: "120,000+",
      description: "Bespoke infrastructure tailored for high-volume financial institutions.",
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
      color: "slate"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      {/* Navbar (Same as Landing Page) */}
      <header
        className={`fixed top-0 w-full z-101 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-4"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SynchGate Logo" className="w-[150px] " />
          </Link>
        </div>
      </header>

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
              Everything you need to <span className="text-blue-600">scale.</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Choose the right plan for your business etapa. No hidden fees, just pure orchestration.
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
                className={`relative rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden ${
                  plan.isAvailable 
                    ? "bg-white border-slate-200 shadow-2xl shadow-slate-200/50 hover:border-blue-300 ring-4 ring-transparent hover:ring-blue-50/50" 
                    : "bg-slate-50/50 border-slate-200 opacity-90 grayscale-[0.3]"
                }`}
              >
                {!plan.isAvailable && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      <Lock className="w-3 h-3" />
                      {plan.tag}
                    </div>
                  </div>
                )}
                
                {plan.isAvailable && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-emerald-200">
                      <TrendingUp className="w-3 h-3" />
                      {plan.tag}
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 shadow-sm ${
                  plan.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-200' : 
                  plan.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' : 
                  'bg-slate-900 text-white shadow-slate-200'
                }`}>
                  <plan.icon className="w-8 h-8" />
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-8 min-h-[60px] leading-relaxed font-medium">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">₦{plan.price}</span>
                  <span className="text-slate-500 font-bold text-lg">/month</span>
                </div>

                <div className="space-y-5 mb-12">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <Check className="w-3 h-4 stroke-[4px]" />
                      </div>
                      <span className={`text-[15px] leading-tight ${plan.isAvailable ? 'text-slate-700 font-bold' : 'text-slate-400 font-medium'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={plan.isAvailable ? "/auth/signup" : "#"}
                  className={`block w-full py-5 rounded-3xl font-black text-center text-[17px] transition-all duration-300 ${
                    plan.isAvailable 
                      ? "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 hover:shadow-2xl active:scale-[0.98]" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {plan.isAvailable ? "Get Started Now" : "Request Early Access"}
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer (Same as Landing Page) */}
      <footer className="border-t border-slate-200 bg-slate-50 relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20">
            <div className="col-span-2">
              <img src={logo} alt="SynchGate Logo" className="w-[140px] mb-6" />
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The unifying infrastructure for modern payments. One API connecting every major processor globally.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Developers</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                 <li><Link to="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
                 <li><a href="#" className="hover:text-blue-600 transition-colors">API Status</a></li>
                 <li><a href="#" className="hover:text-blue-600 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                 <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                 <li><Link to="/contact-us" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                 <li><Link to="/terms-of-use" className="hover:text-blue-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-medium">© 2026 SynchGate Inc. All rights reserved.</p>
            <div className="flex gap-6">
               <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
