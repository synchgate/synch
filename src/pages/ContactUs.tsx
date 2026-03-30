import { useState, useEffect } from "react";
import contactHero from "../assets/contact_us_hero.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Menu, X } from "lucide-react";

export default function ContactUs() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({
    businessEmail: "",
    firstName: "",
    lastName: "",
    company: "",
    product: "",
    details: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "glass-panel border-b border-slate-200 py-4"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Link to="/">
              <img src={logo} alt="SynchGate Logo" className="w-[150px] " />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/contact-us"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              How it works
            </Link>
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
              className="relative hidden md:inline-flex group h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
            >
              <span className="relative z-10 hidden sm:flex items-center gap-1">
                Get started{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="relative z-10 flex sm:hidden items-center gap-1">
                Get started
              </span>
            </Link>
            <button 
              className="md:hidden p-1 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-white flex flex-col pt-6 pb-8 px-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 items-center flex-1 justify-center">
            <Link 
              to="/contact-us" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              to="/#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              How it works
            </Link>
            <Link 
              to="/docs" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <Code2 className="w-6 h-6" /> Docs
            </Link>
            
            <hr className="w-full max-w-[250px] border-slate-200 my-4" />
            
            <Link 
              to="/auth/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-xl font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/auth/signup" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full max-w-[250px] text-center bg-black text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors mt-2 text-lg"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}

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
                    <label className="text-[13px] font-semibold text-slate-800 tracking-wide">Business Email *</label>
                    <input 
                      type="email" 
                      name="businessEmail"
                      value={form.businessEmail}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-slate-800 tracking-wide">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-slate-800 tracking-wide">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-[15px]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-slate-800 tracking-wide">Company *</label>
                    <input 
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
                  <label className="text-[13px] font-semibold text-slate-800 tracking-wide">Product You're Interested In *</label>
                  <div className="relative">
                    <select 
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none text-[15px] cursor-pointer"
                    >
                      <option value="" disabled></option>
                      <option value="Payments">Payments API</option>
                      <option value="Payouts">Payouts</option>
                      <option value="Orchestration">Payment Orchestration</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[13px] font-semibold text-slate-800 tracking-wide">Give us details on your interest in SynchGate. *</label>
                  <textarea 
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    required 
                    rows={6} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-[15px]"
                  ></textarea>
                  <div className="flex justify-end pr-1 mt-[-6px]">
                      <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V6H1L6 1Z" fill="#CBD5E1"/>
                        <path d="M6 3.5V6H3.5L6 3.5Z" fill="#94A3B8"/>
                      </svg>
                  </div>
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
    </div>
  );
}
