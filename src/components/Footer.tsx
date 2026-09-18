import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const linkClass =
  "text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer";

const COLUMNS = [
  {
    title: "Developers",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "API Reference", to: "/docs/initiate-payment" },
      { label: "Response and errors", to: "/docs/errors" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "Create account", to: "/auth/signup" },
      { label: "Log in to dashboard", to: "/auth/login" },
      { label: "Book a demo", to: "/demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact us", to: "/contact-us" },
      { label: "Terms of use", to: "/terms-of-use" },
      { label: "Data privacy", to: "/docs/data-privacy" },
      { label: "PCI compliance", to: "/docs/pci-compliance" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SynchGate Logo" className="w-[130px]" />
            </div>
            <p className="text-slate-600 text-sm max-w-xs mb-4">
              One API for payments and bank transfers across Paystack,
              Flutterwave and Nomba.
            </p>
            <a
              href="mailto:support@synchgate.com"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              support@synchgate.com
            </a>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-slate-900 font-medium mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            © 2026 SynchGate Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
