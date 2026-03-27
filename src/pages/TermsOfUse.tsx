import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png";

function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-slate-200 py-4 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
          </Link>
          <Link
            to="/auth/signup"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Signup
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="font-['Outfit'] text-4xl font-bold text-black">Terms of Use</h1>
            </div>

            <p className="text-slate-500 mb-10 border-b border-slate-100 pb-6">
              Last updated: March 27, 2026
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-black mb-4">1. Overview of Services</h2>
                <p>
                  SynchGate provides a unified infrastructure that enables businesses to integrate, manage, and orchestrate multiple payment providers through a single API.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Payment routing and orchestration</li>
                  <li>Integration with third-party payment gateways</li>
                  <li>Transaction monitoring and analytics</li>
                  <li>Failover and reliability optimization tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">2. Eligibility</h2>
                <p>To use SynchGate, you must:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Be at least 18 years old</li>
                  <li>Represent a registered business or entity</li>
                  <li>Provide accurate and complete registration information</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">3. Account Registration & Verification</h2>
                <p>You agree to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Provide accurate business and identity information</li>
                  <li>Complete KYC (Know Your Customer) requirements when requested</li>
                  <li>Keep your account information up to date</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  SynchGate reserves the right to suspend or terminate accounts that fail verification or provide misleading information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">4. Use of the Platform</h2>
                <p>
                  You agree to use SynchGate only for lawful purposes and in compliance with all applicable regulations.
                </p>
                <p className="font-semibold text-black mt-4 mb-2 italic">You must not:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use the platform for fraudulent or illegal transactions</li>
                  <li>Attempt to bypass security mechanisms</li>
                  <li>Interfere with system integrity or performance</li>
                  <li>Reverse engineer or misuse APIs</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">5. Payment Processing & Third-Party Providers</h2>
                <p>
                  SynchGate acts as an orchestration layer and does not directly process payments. By using our platform:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>You acknowledge that transactions are executed through third-party providers</li>
                  <li>You agree to comply with each provider’s terms and policies</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  SynchGate is not liable for failures, delays, or errors caused by third-party services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">6. Fees & Charges</h2>
                <p>Use of SynchGate may be subject to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Platform fees</li>
                  <li>Transaction-based fees</li>
                  <li>Third-party provider fees</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  All applicable fees will be communicated clearly. You are responsible for all charges incurred through your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">7. Data & Privacy</h2>
                <p>
                  We collect and process data in accordance with our Privacy Policy. By using SynchGate, you consent to:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>The collection and use of your data</li>
                  <li>Sharing necessary data with third-party providers to complete transactions</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  We implement industry-standard security measures but cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">8. Availability & Reliability</h2>
                <p>SynchGate is designed for high availability and reliability; however:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>We do not guarantee uninterrupted service</li>
                  <li>Scheduled maintenance or unexpected downtime may occur</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  We are not liable for losses resulting from service interruptions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">9. AML & Anti-Fraud Compliance</h2>
                <p>
                  SynchGate maintains strict compliance with Anti-Money Laundering (AML) and anti-fraud regulations. By using our platform, you agree to:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Not use SynchGate for money laundering, fraud, or any illegal financial activity</li>
                  <li>Comply with all applicable AML, KYC, and financial regulations</li>
                  <li>Provide requested information for compliance checks when required</li>
                </ul>
                <p className="font-semibold text-black mt-4 mb-2 italic">SynchGate reserves the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Monitor transactions for suspicious activity</li>
                  <li>Report suspicious transactions to relevant authorities</li>
                  <li>Suspend or terminate accounts involved in suspected fraud or illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">10. Chargebacks & Disputes</h2>
                <p>You are solely responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Managing customer disputes and chargebacks</li>
                  <li>Any financial losses arising from chargebacks</li>
                </ul>
                <p className="font-semibold text-black mt-4 mb-2 italic">SynchGate does not assume liability for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chargeback claims</li>
                  <li>Disputes between you and your customers</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  You agree to comply with the dispute resolution policies of your chosen payment providers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">11. API Usage & Rate Limits</h2>
                <p>Access to SynchGate APIs is subject to fair usage policies. You agree not to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Exceed rate limits defined by SynchGate</li>
                  <li>Use automated systems to overload or disrupt the platform</li>
                  <li>Attempt unauthorized access to systems or data</li>
                </ul>
                <p className="font-semibold text-black mt-4 mb-2 italic">SynchGate reserves the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Throttle, suspend, or restrict API access for abuse</li>
                  <li>Modify rate limits at any time to ensure system stability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">12. Service Level Agreement (SLA)</h2>
                <p>
                  SynchGate is committed to delivering a reliable and high-performance platform. However:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>No guaranteed uptime percentage is provided unless explicitly stated in a separate agreement</li>
                  <li>Service interruptions may occur due to maintenance, third-party failures, or unforeseen events</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  For enterprise customers, a separate SLA may be negotiated.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">13. Intellectual Property</h2>
                <p>
                  All rights, title, and interest in SynchGate, including software, APIs, and branding, remain the property of SynchGate Inc. You are granted a limited, non-exclusive, non-transferrable license to use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">14. Limitation of Liability</h2>
                <p>To the fullest extent permitted by law, SynchGate shall not be liable for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Indirect or consequential damages</li>
                  <li>Loss of profits, revenue, or data</li>
                  <li>Issues arising from third-party payment providers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">15. Termination</h2>
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Suspend or terminate your account at any time</li>
                  <li>Restrict access if you violate these Terms</li>
                </ul>
                <p className="mt-2 text-slate-600 italic">
                  You may stop using the service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">16. Changes to Terms</h2>
                <p>
                  We may update these Terms periodically. Continued use of SynchGate after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">17. Governing Law</h2>
                <p>
                  These Terms shall be governed by and interpreted in accordance with the laws of [Insert Country/State].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-black mb-4">18. Contact</h2>
                <p>For questions or concerns regarding these Terms, contact us at:</p>
                <ul className="list-none mt-2 space-y-1">
                  <li><strong>Email:</strong> support@synchgate.com</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-slate-50 relative z-10 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2026 SynchGate Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default TermsOfUse;
