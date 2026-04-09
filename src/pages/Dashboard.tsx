import {
  Activity,
  LineChart,
  Bell,
  Building2,
  Code2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Terminal,
  X,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import logo from "../assets/logo.png";

function Dashboard() {
  const location = useLocation();
  const { logout, userName, kycStatus, merchantMode, updateMerchantMode, userEmail } =
    useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTogglingMode, setIsTogglingMode] = useState(false);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === "/dashboard" && location.pathname === "/dashboard")
    );
  };

  const getInitials = (name: string) => {
    if (!name) return "UU";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    logout();
  };

  const handleToggleMode = async () => {
    const nextMode = merchantMode === "test" ? "live" : "test";
    const wantsLive = nextMode === "live";

    setIsTogglingMode(true);
    // Optimistic UI update via Context
    updateMerchantMode(nextMode);

    if (wantsLive && (kycStatus === "pending" || !kycStatus)) {
      // Simulate network request before showing popup
      setTimeout(() => {
        setIsTogglingMode(false);
        updateMerchantMode("test");
        setShowKycPopup(true);
      }, 800);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      // Use PATCH since it's commonly used for partial updates, or POST if needed.
      await api.patch(
        "/merchants/switch/toggle-merchant-mode/",
        {
          live_mode: wantsLive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Mode transitioned successfully on the server
    } catch (error) {
      console.error("Failed to toggle mode:", error);
      // Revert if API call fails
      updateMerchantMode(merchantMode);
    } finally {
      setIsTogglingMode(false);
    }
  };

  return (
    <div key={userEmail} className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* KYC Popup */}
      {showKycPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Verification Required
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Please complete your KYC verification to toggle to live mode.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowKycPopup(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <Link
                to="/dashboard/settings"
                state={{ tab: "kyc" }}
                onClick={() => setShowKycPopup(false)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer text-sm"
              >
                Complete KYC
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Sign Out
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm cursor-pointer text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
            {/* <span className="font-['Outfit'] font-bold text-xl tracking-tight text-black">
              SynchGate
            </span> */}
          </Link>
          <button
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          {/* Primary Nav */}
          <nav className="space-y-1 mb-8">
            <Link
              to="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <LayoutDashboard className="w-5 h-5" /> Overview
            </Link>

            <Link
              to="/dashboard/transactions"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/transactions") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <Activity className="w-5 h-5" /> Transactions
            </Link>
            <Link
              to="/dashboard/providers"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/providers") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <Building2 className="w-5 h-5" /> Providers
            </Link>
            <Link
              to="/dashboard/analytics"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/analytics") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <LineChart className="w-5 h-5" /> Analytics
            </Link>
            <Link
              to="/dashboard/billings"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/billings") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <CreditCard className="w-5 h-5" /> Billings
            </Link>
            <Link
              to="/dashboard/logs"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/logs") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <Terminal className="w-5 h-5" /> Logs
            </Link>
          </nav>

          {/* Secondary Nav */}
          <div className="mb-4">
            <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Developers
            </h4>
            <nav className="space-y-1">
              <Link
                to="/docs"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Code2 className="w-5 h-5 text-slate-400" /> Documentation
              </Link>
              <Link
                to="/dashboard/api-keys"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/api-keys") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
              >
                <ShieldCheck
                  className={`w-5 h-5 ${isActive("/dashboard/api-keys") ? "text-blue-600" : "text-slate-400"}`}
                />{" "}
                My API Key
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <nav className="space-y-1">
            <Link
              to="/dashboard/settings"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 ${isActive("/dashboard/settings") ? "bg-slate-100 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} rounded-lg transition-colors cursor-pointer`}
            >
              <Settings className="w-5 h-5 text-slate-400" /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900 mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Environment Toggle and Profile */}
          <div className="ml-auto flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200">
              <span
                className={`text-[10px] sm:text-xs font-semibold transition-colors ${merchantMode === "test" ? "text-amber-600" : "text-slate-400"
                  }`}
              >
                Test
              </span>
              <button
                onClick={handleToggleMode}
                disabled={isTogglingMode}
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${isTogglingMode ? "cursor-wait opacity-80" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${merchantMode === "live" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
              >
                <span className="sr-only">Toggle environment</span>
                <span
                  className={`flex h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-sm transition-transform items-center justify-center ${merchantMode === "live"
                    ? "translate-x-5 sm:translate-x-6"
                    : "translate-x-1"
                    }`}
                >
                  {isTogglingMode && (
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 border border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                  )}
                </span>
              </button>
              <span
                className={`text-[10px] sm:text-xs font-semibold transition-colors ${merchantMode === "live"
                  ? "text-emerald-600"
                  : "text-slate-400"
                  }`}
              >
                Live
              </span>
            </div>

            <button className="text-slate-400 hover:text-slate-600 transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full border border-white"></span>
            </button>

            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer shadow-sm">
              {getInitials(userName)}
            </div>
          </div>
        </header>

        {kycStatus === "pending" && (
          <div className="bg-blue-600 px-3 py-2 sm:px-4 sm:py-3 text-white text-[11px] sm:text-sm flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-4 shadow-sm z-20 shrink-0">
            <span className="font-medium truncate sm:whitespace-normal">
              <span className="hidden sm:inline">
                Your account is pending verification. Please complete your KYC
                to unlock all features.
              </span>
              <span className="sm:hidden">KYC pending. Unlock features</span>
            </span>
            <Link
              to="/dashboard/settings"
              state={{ tab: "kyc" }}
              className="bg-white text-blue-600 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold hover:bg-blue-50 transition-colors text-[10px] sm:text-xs whitespace-nowrap shadow-sm shrink-0"
            >
              Complete KYC
            </Link>
          </div>
        )}

        {/* Dashboard Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
