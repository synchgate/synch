import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Check,
  ChevronRight,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Lock,
  Minus,
  Plus,
  ReceiptText,
  Route,
  ShieldCheck,
  Shuffle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import flutterwaveLogo from "../assets/brands/flutterwave.png";
import nombaLogo from "../assets/brands/nomba.png";
import pagaLogo from "../assets/brands/paga.png";
import paypalLogo from "../assets/brands/paypal.png";
import paystackLogo from "../assets/brands/paystack.png";
import { CodeTabs } from "../components/docs/CodeBlock";
import { FlowAnimation } from "../components/docs/FlowAnimation";
import { paymentFlow, transferFlow } from "../components/docs/flows";
import { requestSnippets } from "../components/docs/snippets";
import Footer from "../components/Footer";
import { HeroRouter } from "../components/home/HeroRouter";
import Navbar from "../components/Navbar";
import {
  formatNaira,
  formatPercent,
  MIN_TOPUP_NGN,
  PLATFORM_FEE_PERCENT,
  TOPUP_BONUS_PERCENT,
} from "../config/pricing";

type Provider = {
  src: string;
  alt: string;
  size: string;
  comingSoon?: boolean;
};

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
  { src: nombaLogo, alt: "Nomba", size: "h-6 md:h-[30px]" },
  { src: pagaLogo, alt: "Paga", size: "h-6 md:h-[32px]", comingSoon: true },
  { src: paypalLogo, alt: "PayPal", size: "h-7 md:h-[32px]", comingSoon: true },
];

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Collect payments",
    desc: "Create a hosted checkout on Paystack, Flutterwave or Nomba with one request, then verify every payment by its reference.",
    to: "/docs/initiate-payment",
  },
  {
    icon: Route,
    title: "Smart Route",
    desc: "Let SynchGate choose the provider, using your own routing rules or each provider's recent success rate.",
    to: "/docs/smart-routes",
  },
  {
    icon: Banknote,
    title: "Bank transfers",
    desc: "Pay out to bank accounts through the same API. List banks and confirm the account name before you send.",
    to: "/docs/initiate-transfer",
  },
  {
    icon: Shuffle,
    title: "One response format",
    desc: "Every provider's answer is normalised, so your code does not change when the provider behind it does.",
    to: "/docs/errors",
  },
  {
    icon: FlaskConical,
    title: "Sandbox and live",
    desc: "Build and test with a sandbox key. When you are ready, swap in your live key. Nothing else changes.",
    to: "/docs/authentication",
  },
  {
    icon: LayoutDashboard,
    title: "One dashboard",
    desc: "See transactions and API logs across every provider, and manage your keys and provider connections in one place.",
    to: "/auth/signup",
  },
];

const STEPS = [
  {
    title: "Connect your providers",
    desc: "Add your Paystack, Flutterwave or Nomba credentials in the dashboard. Payments settle in your own provider accounts.",
  },
  {
    title: "Send one request",
    desc: "Call the SynchGate API with your sandbox key. The request and response look the same whichever provider handles it.",
  },
  {
    title: "Go live",
    desc: "Swap in your live key when you are ready. Add a provider or change routing later without touching your integration.",
  },
];

const COMPARISON = [
  {
    topic: "Integrations to build",
    alone: "One for every provider",
    synch: "One, total",
  },
  {
    topic: "Response format",
    alone: "Different for each provider",
    synch: "The same for all of them",
  },
  {
    topic: "Adding or switching a provider",
    alone: "A new integration",
    synch: "Change one field, or use Smart Route",
  },
  {
    topic: "Bank transfers and account lookup",
    alone: "Separate APIs to learn",
    synch: "Built into the same API",
  },
  {
    topic: "Testing",
    alone: "A separate sandbox each",
    synch: "One sandbox key",
  },
];

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Card data stays with the provider",
    desc: "Customers pay on the provider's hosted checkout, so card details never touch your servers. SynchGate does not store them.",
    to: "/docs/pci-compliance",
    cta: "Our PCI approach",
  },
  {
    icon: Lock,
    title: "Credentials stored encrypted",
    desc: "The provider credentials you connect are encrypted at rest.",
    to: "/docs/data-privacy",
    cta: "Data privacy",
  },
  {
    icon: KeyRound,
    title: "Secret-key authentication",
    desc: "Every request is authenticated, with separate sandbox and live keys you can regenerate at any time.",
    to: "/docs/authentication",
    cta: "Authentication",
  },
];

const FAQS = [
  {
    q: "How long does setup take?",
    a: "Most teams send their first sandbox request within minutes. Create an account, copy your sandbox key, connect a provider in the dashboard and call the API.",
  },
  {
    q: "Which payment providers do you support?",
    a: "Paystack, Flutterwave and Nomba are available today. Paga and PayPal are coming soon.",
  },
  {
    q: "Do I need my own provider accounts?",
    a: "Yes. You connect your own Paystack, Flutterwave or Nomba credentials in the dashboard. Payments settle in your provider accounts, and SynchGate routes the requests for you.",
  },
  {
    q: "How does Smart Route work?",
    a: "If you have set up routing rules by amount, currency, country or time of day, the first rule that matches picks the provider. Otherwise SynchGate scores your providers on their success rate and volume over the last hour and uses the best one.",
  },
  {
    q: "What happens if a provider is down?",
    a: "Today you can name a different provider in your request, or use Smart Route, which favours providers that are succeeding. Automatic failover to another provider is planned but is not available yet.",
  },
  {
    q: "Is SynchGate PCI compliant?",
    a: "We do not process payments or handle card details. Payments are processed by the payment providers on their own hosted pages, and they securely handle sensitive card data.",
  },
  {
    q: "Can I test before going live?",
    a: "Yes. Every account has a sandbox key for testing and a live key for real transactions. Sandbox requests are recorded separately from live ones.",
  },
  {
    q: "What does it cost?",
    a: `There is no monthly fee. You fund a wallet (from ${formatNaira(MIN_TOPUP_NGN)}, with ${TOPUP_BONUS_PERCENT}% extra on every top-up) and ${formatPercent(PLATFORM_FEE_PERCENT)} of each successful live payment or payout is taken as the fee (${formatNaira(1)} on ${formatNaira(1000)}). Failed transactions cost nothing, unused cash can be refunded, and the sandbox is free.`,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const paymentSnippets = requestSnippets({
  method: "POST",
  path: "/initiate-payment/",
  body: {
    provider: "paystack",
    email: "customer@example.com",
    amount: 8000,
    reference: "order-2026-000123",
    callback_url: "https://yourdomain.com/payments/callback",
  },
});

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-blue-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-['Outfit'] text-3xl font-bold text-balance text-black md:text-5xl">
        {title}
      </h2>
      {children && (
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          {children}
        </p>
      )}
    </div>
  );
}

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demo, setDemo] = useState<"collect" | "payout">("collect");
  const { hash } = useLocation();

  // The navbar links to /#how-it-works, which the router does not scroll to by itself
  useEffect(() => {
    if (!hash) return;
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-slate-900 selection:bg-blue-500/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-slate-100 blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pb-20 pt-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero */}
          <section className="flex flex-col items-center pb-24 pt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/docs"
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm transition-colors hover:border-blue-300"
              >
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  v1.0 API is live
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-8 max-w-4xl font-['Outfit'] text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl"
            >
              One API for all your{" "}
              <span className="text-blue-600">payment providers.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 max-w-2xl text-base font-light leading-relaxed text-slate-600 md:text-lg"
            >
              Collect payments and send bank transfers across Paystack,
              Flutterwave and Nomba with a single integration, and route each
              payment to the provider that is performing best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex w-full flex-col items-center gap-4 px-4 sm:w-auto sm:flex-row sm:px-0"
            >
              <Link
                to="/auth/signup"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 sm:w-auto"
              >
                Start free
              </Link>
              <Link
                to="/demo"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
              >
                Book a demo
              </Link>
            </motion.div>

            <p className="mt-5 text-xs text-slate-500">
              No monthly fee · {formatPercent(PLATFORM_FEE_PERCENT)} only on
              successful transactions · Test in the sandbox first
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full"
            >
              <HeroRouter />
            </motion.div>
          </section>

          {/* Providers */}
          <section className="border-y border-slate-200 py-16">
            <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-slate-400">
              Connect the providers you already use
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 md:gap-x-20">
              {PROVIDERS.map((provider) => (
                <div
                  key={provider.alt}
                  className="flex flex-col items-center gap-3"
                >
                  <img
                    src={provider.src}
                    alt={provider.alt}
                    className={`${provider.size} w-auto object-contain brightness-0 transition-all duration-300 ${
                      provider.comingSoon
                        ? "opacity-25"
                        : "opacity-50 hover:opacity-100 hover:brightness-100"
                    }`}
                  />
                  {provider.comingSoon && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Coming soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* What you can do */}
          <section id="benefits" className="py-28">
            <SectionIntro
              eyebrow="What you get"
              title="Everything to move money, in one API"
            >
              Payments, payouts and routing behind one integration, so you spend
              your time on your product instead of on provider quirks.
            </SectionIntro>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  {...fadeUp}
                  transition={{ delay: (i % 3) * 0.08 }}
                >
                  <Link
                    to={feature.to}
                    className="group block h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600">
                      <feature.icon className="h-6 w-6 text-blue-600 transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {feature.desc}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* See it in action */}
          <section className="border-t border-slate-200 py-28">
            <SectionIntro
              eyebrow="See it in action"
              title="Follow a request end to end"
            >
              Pick a scenario and watch it move through SynchGate, including
              what happens when something goes wrong.
            </SectionIntro>

            <div className="mx-auto max-w-3xl">
              <div
                role="tablist"
                className="mx-auto mb-6 flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              >
                {(
                  [
                    ["collect", "Collect a payment"],
                    ["payout", "Send a payout"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={demo === id}
                    onClick={() => setDemo(id)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      demo === id
                        ? "bg-black text-white"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <FlowAnimation
                key={demo}
                title={
                  demo === "collect" ? "Collect a payment" : "Send a payout"
                }
                {...(demo === "collect" ? paymentFlow : transferFlow)}
              />
            </div>
          </section>

          {/* How it works */}
          <section
            id="how-it-works"
            className="relative -mx-6 overflow-hidden border-t border-slate-200 bg-slate-50/60 px-6 py-28"
          >
            <div className="mx-auto max-w-7xl">
              <SectionIntro
                eyebrow="Simple 3-step process"
                title="From sign-up to first payment"
              />

              <div className="grid items-start gap-12 lg:grid-cols-2">
                <ol className="space-y-8">
                  {STEPS.map((step, i) => (
                    <motion.li
                      key={step.title}
                      {...fadeUp}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-['Outfit'] text-lg font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="mb-1 font-['Outfit'] text-2xl font-bold text-black">
                          {step.title}
                        </h3>
                        <p className="leading-relaxed text-slate-600">
                          {step.desc}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                  <li>
                    <Link
                      to="/docs/installation"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Read the quickstart <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                </ol>

                <div className="min-w-0">
                  <CodeTabs snippets={paymentSnippets} className="mb-0" />
                </div>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="py-28">
            <SectionIntro
              eyebrow="Why SynchGate"
              title="Less to build, less to maintain"
            >
              Integrating every provider yourself means repeating the same work
              for each one.
            </SectionIntro>

            <div className="mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-medium" />
                    <th className="px-6 py-4 font-medium">
                      Integrating providers yourself
                    </th>
                    <th className="px-6 py-4 font-medium text-blue-600">
                      With SynchGate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARISON.map((row) => (
                    <tr key={row.topic}>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {row.topic}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <X className="h-4 w-4 shrink-0 text-slate-300" />
                          {row.alone}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                          {row.synch}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing teaser */}
          <section className="border-t border-slate-200 py-28">
            <SectionIntro eyebrow="Pricing" title="Pay only when money moves">
              No monthly fee. Fund a wallet and a flat fee is taken for each
              successful live payment or payout. Nothing is hidden, and the
              sandbox is always free.
            </SectionIntro>

            <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
              {[
                {
                  price: formatPercent(PLATFORM_FEE_PERCENT),
                  note: `of each successful transaction, payments and payouts alike. ${formatNaira(1)} on ${formatNaira(1000)}.`,
                  highlight: true,
                },
                {
                  price: `${TOPUP_BONUS_PERCENT}% extra`,
                  note: `on every top-up, from ${formatNaira(MIN_TOPUP_NGN)}`,
                  highlight: false,
                },
                {
                  price: "₦0",
                  note: "for failed transactions, the sandbox and the monthly fee",
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.price}
                  className={`rounded-3xl border p-8 ${
                    item.highlight
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-['Outfit'] text-4xl font-bold text-black">
                    {item.price}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-600">
              Cash you haven't used can be refunded, and the fee is given back
              if a payout is reversed.
            </p>
            <div className="mt-8 text-center">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
              >
                See full pricing <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Trust */}
          <section className="border-t border-slate-200 bg-slate-50/60 -mx-6 px-6 py-28">
            <div className="mx-auto max-w-7xl">
              <SectionIntro
                eyebrow="Security"
                title="Built to keep sensitive data out of your way"
              />
              <div className="grid gap-6 md:grid-cols-3">
                {TRUST.map((item, i) => (
                  <motion.div
                    key={item.title}
                    {...fadeUp}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {item.cta} <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-b border-slate-200 py-28">
            <div className="mx-auto max-w-4xl">
              <SectionIntro title="Frequently asked questions">
                Everything you need to know before you start.
              </SectionIntro>

              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      aria-expanded={activeFaq === i}
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="text-lg font-bold text-slate-900">
                        {faq.q}
                      </span>
                      {activeFaq === i ? (
                        <Minus className="h-5 w-5 shrink-0 text-blue-600" />
                      ) : (
                        <Plus className="h-5 w-5 shrink-0 text-slate-400" />
                      )}
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: activeFaq === i ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 p-6 pt-4 leading-relaxed text-slate-600">
                        {faq.a}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-28 text-center">
            <div className="absolute inset-0 rounded-3xl bg-blue-50 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-12 shadow-sm backdrop-blur md:p-20">
              <div className="absolute right-0 top-0 rounded-full bg-blue-100 p-32 blur-[100px]" />
              <div className="absolute bottom-0 left-0 rounded-full bg-slate-100 p-32 blur-[100px]" />

              <h2 className="relative z-10 mb-6 font-['Outfit'] text-4xl font-bold text-black md:text-5xl">
                Ready to simplify your payments?
              </h2>
              <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg text-slate-600 md:text-xl">
                Create an account, get your sandbox key and make your first
                request in minutes.
              </p>

              <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/auth/signup"
                  className="w-full rounded-xl bg-black px-8 py-4 font-semibold text-white shadow-lg shadow-slate-200 transition-colors hover:bg-slate-800 sm:w-auto"
                >
                  Create free account
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
                >
                  Explore documentation{" "}
                  <ChevronRight className="ml-1 h-4 w-4" />
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
