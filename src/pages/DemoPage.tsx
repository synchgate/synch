import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Calendar, Phone, Mail, User, Building2, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { contactService } from "../services/contact";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DemoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    company_name: "",
    preferred_date: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        ...form,
        preferred_date: new Date(form.preferred_date).toISOString(),
      };
      
      await contactService.submitDemoRequest(payload);
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone_number: "",
        company_name: "",
        preferred_date: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Demo request error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || 
        "Something went wrong while booking your demo. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 relative">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]"></div>
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-slate-50 blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Context & Hero */}
          <div className="lg:w-1/2 lg:sticky lg:top-40">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            
            <h1 className="font-['Outfit'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-black">
              See the future of <span className="text-blue-600">payments.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-xl font-light">
              Join a 30-minute deep dive into SynchGate. Discover how our unified API and intelligent routing can save you thousands in processing fees and months of development time.
            </p>

            <div className="space-y-8">
              {[
                {
                  title: "Expert Guidance",
                  desc: "One-on-one session with our product experts tailored to your business needs."
                },
                {
                  title: "Technical Walkthrough",
                  desc: "A deep dive into our API documentation and integration patterns."
                },
                {
                  title: "Custom Pricing",
                  desc: "Get a personalized quote based on your transaction volume and requirements."
                }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold mb-1">{benefit.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="relative z-10">
                {status === "success" ? (
                  <div className="text-center space-y-6 py-12">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-14 h-14" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Confirmed!</h3>
                      <p className="text-slate-600 max-w-sm mx-auto leading-relaxed text-lg">
                        We've received your request. Check your inbox for a confirmation email and calendar invite.
                      </p>
                    </div>
                    <div className="pt-8">
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                      >
                        Return Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 text-center lg:text-left">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Book your demo session</h2>
                      <p className="text-slate-500 mt-2">Fill in your details and we'll be in touch.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {status === "error" && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{errorMessage}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                            <User className="w-4 h-4 text-blue-600" /> Full Name
                          </label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                            <Mail className="w-4 h-4 text-blue-600" /> Business Email
                          </label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="jane@company.com"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                            <Phone className="w-4 h-4 text-blue-600" /> Phone Number
                          </label>
                          <input
                            required
                            type="tel"
                            name="phone_number"
                            value={form.phone_number}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                            <Building2 className="w-4 h-4 text-blue-600" /> Company Name
                          </label>
                          <input
                            required
                            type="text"
                            name="company_name"
                            value={form.company_name}
                            onChange={handleChange}
                            placeholder="Acme Inc."
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                          <Calendar className="w-4 h-4 text-blue-600" /> Preferred Date & Time
                        </label>
                        <input
                          required
                          type="datetime-local"
                          name="preferred_date"
                          value={form.preferred_date}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                          <MessageSquare className="w-4 h-4 text-blue-600" /> How can we help?
                        </label>
                        <textarea
                          required
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us a bit about your current payment challenges..."
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-hidden text-[16px] bg-slate-50/50 focus:bg-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-blue-600 text-white font-bold py-5 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg mt-4 active:scale-[0.98]"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Booking your session...
                          </>
                        ) : (
                          "Book My Demo Session"
                        )}
                      </button>
                      
                      <p className="text-center text-slate-400 text-xs mt-4">
                        By submitting this form, you agree to our privacy policy and terms of service.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
