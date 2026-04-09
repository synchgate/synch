import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Printer,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { type Invoice, invoices } from "../../data/billingData";

function InvoiceHistory() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handlePrint = () => {
    // Basic print trigger using native browser capability
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard/billings"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Billings
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 font-['Outfit']">
            Invoice History
          </h1>
          <p className="text-slate-500">
            View and download all your past billing statements.
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Billing Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900 underline-offset-4 group-hover:underline">
                        {invoice.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        invoice.status === "paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : invoice.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedInvoice.id}
                    </h2>
                    <p className="text-sm text-slate-500">Invoice Details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
                  >
                    <Printer className="w-4 h-4" />
                    Print / PDF
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div
                className="flex-1 overflow-y-auto p-8 sm:p-12 print:p-0"
                id="invoice-content"
                ref={printRef}
              >
                <div className="max-w-3xl mx-auto space-y-12">
                  {/* Branding & Status */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 font-black text-2xl mb-4 italic">
                        SynchGate
                      </div>
                      <div className="space-y-1 text-sm text-slate-500">
                        <p className="flex items-center gap-2 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          721 Financial Towers, Victoria Island, Lagos
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          billing@synchgate.io
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${
                          selectedInvoice.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {selectedInvoice.status}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Date Issued
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {selectedInvoice.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Due Date
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {selectedInvoice.dueDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Billing To */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
                      Billed To
                    </p>
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {selectedInvoice.billingTo.businessName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2 leading-relaxed max-w-xs">
                        {selectedInvoice.billingTo.address}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        {selectedInvoice.billingTo.email}
                      </p>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-slate-900/5">
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                            Qty
                          </th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                            Rate
                          </th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-6 pr-4">
                              <p className="font-bold text-slate-900 text-sm">
                                {item.description}
                              </p>
                            </td>
                            <td className="py-6 text-right text-sm text-slate-600">
                              {item.quantity}
                            </td>
                            <td className="py-6 text-right text-sm text-slate-600">
                              {formatCurrency(item.rate)}
                            </td>
                            <td className="py-6 text-right text-sm font-bold text-slate-900">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end pt-8">
                    <div className="w-full sm:w-64 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">
                          Subtotal
                        </span>
                        <span className="text-slate-900 font-bold">
                          {formatCurrency(selectedInvoice.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">
                          Tax (%)
                        </span>
                        <span className="text-slate-900 font-bold">
                          {formatCurrency(selectedInvoice.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900/5">
                        <span className="text-slate-900 font-black uppercase text-xs tracking-wider">
                          Total Amount
                        </span>
                        <span className="text-2xl font-black text-blue-600">
                          {formatCurrency(selectedInvoice.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 text-center">
                    <p className="text-xs text-blue-800 font-bold mb-1 italic">
                      Thank you for your business!
                    </p>
                    <p className="text-[10px] text-blue-600/70 font-medium">
                      If you have any questions concerning this invoice, contact
                      our billing department at billing@synchgate.io
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Hidden on print) */}
              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0 print:hidden">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default InvoiceHistory;
