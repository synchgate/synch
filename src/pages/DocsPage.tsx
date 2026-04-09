import {
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  Menu,
  Shield,
  Webhook,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";

function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === "/docs" && location.pathname === "/docs")
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 glass-panel border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              className="lg:hidden text-slate-600 hover:text-blue-600 cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
            </Link>
            <span className="hidden sm:block text-slate-300 font-medium">
              /
            </span>
            <span className="hidden sm:block font-medium text-slate-800 truncate">
              Documentation
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth/signup"}
              className="relative group inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Dashboard{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 flex relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-[73px] left-0 h-[calc(100vh-73px)] w-full sm:w-64 bg-white/95 backdrop-blur-md lg:backdrop-blur-none lg:bg-transparent lg:border-none lg:shadow-none lg:sticky
            border-r border-slate-200 overflow-y-auto p-6 z-40 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav
            className="space-y-8"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsSidebarOpen(false);
              }
            }}
          >
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Getting Started
              </h4>
              <ul className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                <li>
                  <Link
                    to="/docs"
                    className={`block text-sm font-medium ${isActive("/docs") || isActive("/docs/introduction") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/installation"
                    className={`block text-sm font-medium ${isActive("/docs/installation") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Installation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> Collect Payments
              </h4>
              <ul className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                <li>
                  <Link
                    to="/docs/initiate-payment"
                    className={`block text-sm font-medium ${isActive("/docs/initiate-payment") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Initiate Payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/transaction-verification"
                    className={`block text-sm font-medium ${isActive("/docs/transaction-verification") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Transaction Verification
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Transfer
              </h4>
              <ul className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                <li>
                  <Link
                    to="/docs/banks"
                    className={`block text-sm font-medium ${isActive("/docs/banks") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Banks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/resolve-account"
                    className={`block text-sm font-medium ${isActive("/docs/resolve-account") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Resolve Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/initiate-transfer"
                    className={`block text-sm font-medium ${isActive("/docs/initiate-transfer") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Initiate Transfer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Webhook className="w-4 h-4 text-blue-500" /> Webhooks
              </h4>
              <ul className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                <li>
                  <button
                    type="button"
                    className="block text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                    onClick={(e) => e.preventDefault()}
                  >
                    Overview
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> Compliance &
                Privacy
              </h4>
              <ul className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                <li>
                  <Link
                    to="/docs/pci-compliance"
                    className={`block text-sm font-medium ${isActive("/docs/pci-compliance") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    PCI Compliance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/data-privacy"
                    className={`block text-sm font-medium ${isActive("/docs/data-privacy") ? "text-blue-600 cursor-default" : "text-slate-600 hover:text-blue-600 cursor-pointer"} transition-colors`}
                  >
                    Data Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm w-full h-full border-none p-0"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar"
          ></button>
        )}

        {/* Main Content Area (Outlet renders the matching child route) */}
        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-12 max-w-4xl relative overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DocsPage;
