import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  ArrowLeft, 
  MessageSquare, 
  LifeBuoy, 
  ShieldCheck, 
  CreditCard,
  AlertCircle 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SupportTicket = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const supportTypes = [
    { id: "billing", label: "Billing & Invoices", icon: CreditCard },
    { id: "technical", label: "Technical Issue", icon: LifeBuoy },
    { id: "security", label: "Security & Access", icon: ShieldCheck },
    { id: "general", label: "General Inquiry", icon: MessageSquare },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ticket Created!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
            Your support ticket has been submitted successfully. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => navigate("/dashboard/billings")}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
          >
            Back to Billing
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Link
        to="/dashboard/billings"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Billing
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Support Ticket</h1>
          <p className="text-slate-500 mt-2">
            Have a question or issue? Fill out the form below and we'll help you out.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700">
                  Contact Email
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Support Type Field */}
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-bold text-slate-700">
                  Support Category
                </label>
                <select
                  required
                  id="type"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat"
                >
                  <option value="">Select a category</option>
                  {supportTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-bold text-slate-700">
                Subject
              </label>
              <input
                required
                type="text"
                id="subject"
                placeholder="Briefly describe what you need help with"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-slate-700">
                How can we help?
              </label>
              <textarea
                required
                id="message"
                rows={5}
                placeholder="Provide as much detail as possible..."
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Ticket...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    Create Support Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Info Box */}
        <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 leading-relaxed">
            <span className="font-bold">Pro-tip:</span> Including transaction IDs, route types 
            (Auto/Manual), and timestamps will help us resolve your issue much faster.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
