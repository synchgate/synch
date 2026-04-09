import { Fingerprint, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SynchGate Logo" className="w-[130px]" />
            </div>
            <p className="text-slate-600 text-sm max-w-xs mb-6">
              The unifying infrastructure for modern payments. One API
              connecting every major processor and localized method globally.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-medium mb-4">Developers</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/docs"
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/initiate-payment"
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <a className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer">
                  System Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-medium mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/pricing"
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/login"
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  Log in to Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/signup"
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © 2026 SynchGate Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <Fingerprint className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
