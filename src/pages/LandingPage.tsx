import { motion } from "framer-motion";
import {
  Building2,
  ChevronRight,
  Cpu,
  Globe,
  Layers,
  Link as LinkIcon,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import flutterwaveLogo from "../assets/brands/flutterwave.png";
import nombaLogo from "../assets/brands/nomba.png";
import pagaLogo from "../assets/brands/paga.png";
import paypalLogo from "../assets/brands/paypal.png";
import paystackLogo from "../assets/brands/paystack.png";
import businessOwners from "../assets/business-owners.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type Provider = { src: string; alt: string; size: string };

const PROVIDERS: Provider[] = [
  {
    src: paystackLogo,
    alt: "Paystack",
    size: "max-w-[180px] md:max-w-[250px] h-16 md:h-[78px]",
  },
  {
    src: flutterwaveLogo,
    alt: "Flutterwave",
    size: "max-w-[200px] md:max-w-[270px] h-[72px] md:h-[98px]",
  },
  { src: pagaLogo, alt: "Paga", size: "h-6 md:h-[32px]" },
  { src: nombaLogo, alt: "Nomba", size: "h-6 md:h-[30px]" },
  { src: paypalLogo, alt: "PayPal", size: "h-7 md:h-[32px]" },
];

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      <Navbar />

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
              An open payments infrastructure that lets you connect any provider
              and intelligently manage every transaction flow—from unified APIs
              and webhooks to seamless routing, payouts, and global payment
              experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
            >
              <Link
                to="/demo"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 cursor-pointer text-center"
              >
                Book a demo
              </Link>
              <Link
                to="/auth/signup"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create an account
              </Link>
            </motion.div>
          </section>

          {/* Integration Comparison Feature */}
          <section
            id="benefits"
            className="py-24 border-t border-slate-200 relative"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              <div className="order-2 lg:order-1 relative w-full min-w-0">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-100 to-slate-200 rounded-2xl blur opacity-50"></div>
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
                  All your payment
                  <br />
                  providers, One Unified control layer.
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Setting up different payment methods for your business is slow
                  and frustrating. Instead of juggling multiple accounts and
                  messy reports, SynchGate gives you one simple way to handle
                  everything.
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
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
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

          {/* Trusted By / Providers Marquee */}
          <section className="py-20 overflow-hidden relative border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                Our Available Payment Providers
              </p>
            </div>

            <div className="relative max-w-full mx-auto flex items-center">
              <motion.div
                className="flex items-center w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {[1, 2].map((set) => (
                  <div
                    key={set}
                    className="flex items-center gap-16 md:gap-32 px-8 md:px-16 shrink-0"
                  >
                    {PROVIDERS.map((logo) => (
                      <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className={`${logo.size} object-contain brightness-0 opacity-40 hover:brightness-100 hover:opacity-100 transition-all duration-300`}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4 block"
                >
                  Simple 3-Step Process
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="font-['Outfit'] text-4xl md:text-5xl font-bold text-black mb-6"
                >
                  How it works
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-600 text-lg max-w-2xl mx-auto"
                >
                  We've simplified the complex world of global payments into
                  three easy steps. No rocket science, just results.
                </motion.p>
              </div>

              <div className="relative">
                {/* Desktop Connectors */}
                <div className="hidden lg:block absolute top-[28%] left-[25%] w-[18%] text-blue-200">
                  <svg viewBox="0 0 100 20" className="w-full">
                    <motion.path
                      d="M0 10 Q 50 10 100 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                      animate={{ strokeDashoffset: [0, -8] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </svg>
                </div>
                <div className="hidden lg:block absolute top-[28%] right-[25%] w-[18%] text-blue-200">
                  <svg viewBox="0 0 100 20" className="w-full">
                    <motion.path
                      d="M0 10 Q 50 10 100 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                      animate={{ strokeDashoffset: [0, -8] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </svg>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                  {[
                    {
                      icon: UserPlus,
                      title: "1. Connect & Go",
                      desc: "Sign up and connect your existing payment providers like Paystack or Flutterwave in minutes.",
                      bgColor: "bg-blue-600/5",
                      iconColor: "text-blue-600",
                    },
                    {
                      icon: LinkIcon,
                      title: "2. One Simple Tool",
                      desc: "Use our single API or no-code dashboard to power your entire payment stack without the mess.",
                      bgColor: "bg-indigo-600/5",
                      iconColor: "text-indigo-600",
                    },
                    {
                      icon: TrendingUp,
                      title: "3. Routing",
                      desc: "The current routing system uses explicit provider selection based on your preference.",
                      bgColor: "bg-slate-600/5",
                      iconColor: "text-slate-600",
                    },
                  ].map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="relative flex flex-col items-center text-center group"
                    >
                      <div className="w-20 h-20 rounded-3xl glass-panel flex items-center justify-center mb-8 border border-slate-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative">
                        <div
                          className={`absolute inset-0 ${step.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity`}
                        ></div>
                        <step.icon
                          className={`w-8 h-8 ${step.iconColor} relative z-10`}
                        />
                      </div>
                      <h3 className="font-['Outfit'] text-2xl font-bold mb-4 text-black">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-light px-4">
                        {step.desc}
                      </p>

                      {/* Mobile Vertical Connector */}
                      {i < 2 && (
                        <div className="lg:hidden h-20 w-px bg-linear-to-b from-blue-200 to-transparent my-8 relative">
                          <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-blue-400 rounded-full"
                            animate={{
                              top: ["0%", "100%"],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Connectors */}
                <div className="lg:hidden flex flex-col items-center gap-12 mt-12">
                  {/* Mobile version would be easier with just vertical spacing, 
                       but the icons above already show the sequence */}
                </div>
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-24 border-b border-slate-200 bg-slate-50/50 -mx-8 px-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-['Outfit'] text-3xl md:text-5xl font-bold mb-4 text-black">
                  Built for every stage of business
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Whether you're just starting or scaling globally, SynchGate
                  provides the infrastructure you need to succeed.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Zap,
                    title: "Startups & Founders",
                    desc: "Launch your product faster with a single integration that scales with you from day one.",
                  },
                  {
                    icon: ShoppingBag,
                    title: "E-commerce Brands",
                    desc: "Expand to new markets instantly by enabling multiple payment gateways with a single API.",
                  },
                  {
                    icon: Building2,
                    title: "Scaling Platforms",
                    desc: "Improve reliability with smart routing and automated failovers.",
                  },
                  {
                    icon: Cpu,
                    title: "Fintech Builders",
                    desc: "Build complex payment experiences and custom flows on top of our robust, developer-first APIs.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                      <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-['Outfit'] text-3xl md:text-5xl font-bold mb-4 text-black">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-lg">
                  Everything you need to know about Us.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "How long does setup take?",
                    a: "You can be up and running in minutes. Our simplified dashboard help you setup your account, get your API keys and make your first charge.",
                  },
                  {
                    q: "Which payment providers do you support?",
                    a: "We currently support some global providers including Flutterwave, Paystack, and Nomba. We are constantly adding new integrations based on customer demand.",
                  },
                  {
                    q: "Is SynchGate PCI compliant?",
                    a: "We do not process payments or handle user cards details. All payments are processed by payment gateways (providers) and they securely handle sensitive payment data.",
                  },
                  {
                    q: "How does smart routing work?",
                    a: "(this feature is coming soon)",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-900 text-lg">
                        {faq.q}
                      </span>
                      {activeFaq === i ? (
                        <Minus className="w-5 h-5 text-blue-600 shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: activeFaq === i ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
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
                Join hundreds of businesses building on SynchGate. Create an
                account, get your API keys, and make your first charge in
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

      <Footer />
    </div>
  );
}

export default LandingPage;
