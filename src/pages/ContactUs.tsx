import { useState } from "react";
import { contactService } from "../services/contact";
import contactHero from "../assets/contact_us_hero.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    fullName: "",
    businessEmail: "",
    phone: "",
    details: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await contactService.submitContact({
        name: form.fullName,
        email: form.businessEmail,
        phone: form.phone,
        message: form.details,
        contact_me: true,
      });
      setStatus("success");
      setForm({
        fullName: "",
        businessEmail: "",
        phone: "",
        details: "",
      });
    } catch (error: any) {
      console.error("Contact form error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || 
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] rounded-lg"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch">
          {/* Left Column - Hero Image */}
          <div className="w-full lg:w-1/2 flex">
            <div className="w-full rounded-4xl overflow-hidden shadow-xs relative">
              <img
                src={contactHero}
                alt="Team discussing in modern office"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Form Container */}
          <div className="w-full lg:w-1/2 flex">
            <div className="w-full bg-white rounded-4xl border border-slate-100 p-8 md:p-10 lg:p-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
              {status === "success" ? (
                <div className="text-center space-y-6 py-8">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Message Sent!</h2>
                    <p className="text-slate-600 max-w-xs mx-auto leading-relaxed">
                      Thank you for reaching out. Our team will get back to you as soon as possible.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3 text-rose-600">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="fullName"
                        className="text-[13px] font-semibold text-slate-800 tracking-wide"
                      >
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="businessEmail"
                          className="text-[13px] font-semibold text-slate-800 tracking-wide"
                        >
                          Business Email *
                        </label>
                        <input
                          id="businessEmail"
                          type="email"
                          name="businessEmail"
                          placeholder="john@company.com"
                          value={form.businessEmail}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="phone"
                          className="text-[13px] font-semibold text-slate-800 tracking-wide"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          placeholder="+234 800 000 0000"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                        />
                      </div>
                    </div>
                  </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label
                    htmlFor="details"
                    className="text-[13px] font-semibold text-slate-800 tracking-wide"
                  >
                    Give us details on your interest in SynchGate. *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-[15px]"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#007edc] hover:bg-[#006bbd] text-white font-medium py-[10px] px-6 rounded-lg transition-all shadow-sm text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
