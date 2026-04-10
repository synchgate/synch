import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Loader2, Calendar, Phone, Mail, User, Building2, MessageSquare } from "lucide-react";
import { contactService } from "../services/contact";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
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
      // Ensure date is in ISO format
      const payload = {
        ...form,
        preferred_date: new Date(form.preferred_date).toISOString(),
      };
      
      await contactService.submitDemoRequest(payload);
      setStatus("success");
      // Reset form on success
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

  if (!isOpen && status === "idle") return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop - Note: No onClick here as requested */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-4xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="relative h-32 bg-linear-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white tracking-tight">Schedule a Live Demo</h2>
              <p className="text-blue-100 text-sm mt-1">See how SynchGate can transform your payment infrastructure.</p>
            </div>

            <div className="p-8">
              {status === "success" ? (
                <div className="text-center space-y-6 py-8">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Request Received!</h3>
                    <p className="text-slate-600 max-w-xs mx-auto leading-relaxed">
                      Our team will reach out shortly to confirm your demo session for the requested date.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Got it, thanks!
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === "error" && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-600" /> Full Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-600" /> Business Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        placeholder="09092320874"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" /> Company Name
                      </label>
                      <input
                        required
                        type="text"
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                        placeholder="TechCorp"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Preferred Date & Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      name="preferred_date"
                      value={form.preferred_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Message
                    </label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="What would you like us to focus on?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden text-[15px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Schedule My Demo"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
