import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Code2,
  Fingerprint,
  Globe,
  Layers,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import businessOwners from "../assets/business-owners.png";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "glass-panel border-b border-slate-200 py-4"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SynchGate Logo" className="w-[150px] " />
            {/* <span className="font-['Outfit'] font-bold text-xl tracking-tight text-black">
              SynchGate
            </span> */}
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              How it works
            </a>
            <Link
              to="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-4 h-4" /> Docs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/auth/login"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Log in
            </Link>
            <Link
              to="/auth/signup"
              className="relative group inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
            >
              <span className="relative z-10 hidden sm:flex items-center gap-1">
                Get API Keys{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="relative z-10 flex sm:hidden items-center gap-1">
                Try Free
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <section className="pt-20 pb-32 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm mb-8 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                v1.0 API is now live
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-['Outfit'] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] max-w-4xl text-black mx-auto"
            >
              Your Payments, <br className="hidden md:block" />
              <span className="text-blue-600">Intelligently Orchestrated.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-slate-600 max-w-2xl mb-12 font-light leading-relaxed"
            >
              An open payments infrastructure that lets you connect any provider and intelligently manage every transaction flow—from unified APIs and webhooks to seamless routing, payouts, and global payment experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
            >
              <Link
                to="/auth/signup"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 cursor-pointer"
              >
                Start Building Free
              </Link>
              <Link
                to="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Read the Docs
              </Link>
            </motion.div>
          </section>

          {/* Integration Comparison Feature */}
          <section
            id="how-it-works"
            className="py-24 border-y border-slate-200 relative"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              <div className="order-2 lg:order-1 relative w-full min-w-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-slate-200 rounded-2xl blur opacity-50"></div>
                <div className="relative glass-panel rounded-2xl p-2 overflow-hidden w-full shadow-2xl border border-slate-200/50">
                  <img
                    src={businessOwners}
                    alt="Success Stories"
                    className="w-full h-auto rounded-xl object-cover hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="font-['Outfit'] text-3xl md:text-5xl font-bold mb-6 text-black">
                  Why manage multiple
                  <br />
                  providers when you only need one?
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Setting up different payment methods for your business is slow and frustrating.
                  Instead of juggling multiple accounts and messy reports, SynchGate gives you
                  one simple way to handle everything.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "One Connection",
                      desc: "Connect once and get access to every payment method your customers want as you grow.",
                    },
                    {
                      icon: Globe,
                      title: "Smart Savings",
                      desc: "We automatically find the best way to route every payment, saving you money on every sale.",
                    },
                    {
                      icon: Layers,
                      title: "Simple Dashboard",
                      desc: "See all your sales and money in one clean view, no matter how your customers choose to pay.",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-medium text-lg mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative text-center">
            <div className="absolute inset-0 bg-blue-50 rounded-3xl blur-3xl"></div>
            <div className="relative glass-panel rounded-3xl p-12 md:p-20 border border-slate-200 overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-32 bg-blue-100 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 p-32 bg-slate-100 blur-[100px] rounded-full"></div>

              <h2 className="font-['Outfit'] text-4xl md:text-5xl font-bold mb-6 text-black relative z-10">
                Ready to simplify?
              </h2>
              <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
                Join hundreds of engineering teams building on SynchGate. Create
                an account, get your API keys, and make your first charge in
                minutes.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
                <Link
                  to="/auth/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 cursor-pointer"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/docs"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center justify-center cursor-pointer"
                >
                  Explore Documentation{" "}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 relative z-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-['Outfit'] font-bold text-lg tracking-tight text-black">
                  SynchGate
                </span>
              </div>
              <p className="text-slate-600 text-sm max-w-xs mb-6">
                The unifying infrastructure for modern payments. One API
                connecting every major processor and localized method globally.
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-medium mb-4">Developers</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="#api"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#status"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-medium mb-4">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#pricing"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/auth/login"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    Log in to Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth/signup"
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                  >
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              © 2026 SynchGate Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Fingerprint className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
