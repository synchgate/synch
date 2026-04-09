import { useState } from "react";
import contactHero from "../assets/contact_us_hero.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ContactUs() {
  const [form, setForm] = useState({
    businessEmail: "",
    firstName: "",
    lastName: "",
    company: "",
    product: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted", form);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setForm({
      businessEmail: "",
      firstName: "",
      lastName: "",
      company: "",
      product: "",
      details: "",
    });
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={form.businessEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="firstName"
                      className="text-[13px] font-semibold text-slate-800 tracking-wide"
                    >
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="lastName"
                      className="text-[13px] font-semibold text-slate-800 tracking-wide"
                    >
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="company"
                      className="text-[13px] font-semibold text-slate-800 tracking-wide"
                    >
                      Company *
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label
                    htmlFor="product"
                    className="text-[13px] font-semibold text-slate-800 tracking-wide"
                  >
                    Product You're Interested In *
                  </label>
                  <div className="relative">
                    <select
                      id="product"
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none text-[15px] cursor-pointer"
                    >
                      <option value="" disabled></option>
                      <option value="Payments">Payments API</option>
                      <option value="Payouts">Payouts</option>
                      <option value="Orchestration">
                        Payment Orchestration
                      </option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-labelledby="select-icon-title"
                      >
                        <title id="select-icon-title">Dropdown icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
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
                    className="w-full bg-[#007edc] hover:bg-[#006bbd] text-white font-medium py-[10px] px-6 rounded-lg transition-colors shadow-sm text-[15px]"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
