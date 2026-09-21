import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Building2,
  Code2,
  CreditCard,
  ExternalLink,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import {
  formatNaira,
  unwrap,
  type WalletSummary,
  walletState,
} from "../lib/dashboard";

type NavEntry = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** matches only this exact path, not the pages beneath it */
  exact?: boolean;
  soon?: boolean;
  external?: boolean;
};

const NAV_GROUPS: { heading?: string; items: NavEntry[] }[] = [
  {
    items: [
      {
        to: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { to: "/dashboard/transactions", label: "Transactions", icon: Activity },
      { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      {
        to: "/dashboard/providers",
        label: "Providers & Routing",
        icon: Building2,
      },
    ],
  },
  {
    heading: "Developers",
    items: [
      { to: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
      { to: "/dashboard/logs", label: "Logs", icon: Terminal, soon: true },
      { to: "/docs", label: "Documentation", icon: Code2, external: true },
    ],
  },
  {
    heading: "Account",
    items: [
      { to: "/dashboard/billing", label: "Wallet", icon: CreditCard },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
      {
        to: "/dashboard/support-ticket",
        label: "Help & support",
        icon: LifeBuoy,
      },
    ],
  },
];

function Dashboard() {
  const location = useLocation();
  const {
    logout,
    userName,
    kycStatus,
    accountLive,
    merchantMode,
    updateMerchantMode,
    syncAccount,
    userEmail,
  } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const isActive = (entry: NavEntry) =>
    entry.exact
      ? location.pathname === entry.to
      : location.pathname === entry.to ||
        location.pathname.startsWith(`${entry.to}/`);

  // Shared with the Wallet page, so this costs no extra request there
  const { data: wallet } = useQuery({
    queryKey: ["wallet", userEmail],
    queryFn: async () => unwrap<WalletSummary>(await api.get("/wallet/")),
    enabled: !!userEmail,
    retry: false,
    staleTime: 60_000,
  });
  const walletStatus = walletState(wallet);

  // Whether the account is live comes from the server, and follows KYC approval. Asking again on
  // load and on returning to the tab means an approval shows up without logging out and back in.
  const { data: account } = useQuery({
    queryKey: ["account-status", userEmail],
    queryFn: async () =>
      unwrap<{ merchants?: { live_mode?: boolean; kyc_status?: string }[] }>(
        await api.get("/accounts/user/details/"),
      ),
    enabled: !!userEmail,
    retry: false,
    staleTime: 60_000,
  });
  const ownMerchant = account?.merchants?.[0];
  // biome-ignore lint/correctness/useExhaustiveDependencies: only the server's values should trigger this
  useEffect(() => {
    if (!ownMerchant) return;
    syncAccount({
      kycStatus: ownMerchant.kyc_status,
      accountLive: ownMerchant.live_mode === true,
    });
  }, [ownMerchant?.live_mode, ownMerchant?.kyc_status]);

  const getInitials = (name: string) => {
    if (!name) return "UU";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Chooses which dashboard to look at. It does not touch the account: whether live keys work is
  // decided by KYC approval alone.
  const handleToggleMode = () => {
    const nextMode = merchantMode === "test" ? "live" : "test";
    if (nextMode === "live" && !accountLive) {
      setShowKycPopup(true);
      return;
    }
    updateMerchantMode(nextMode);
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
      active
        ? "bg-slate-100 text-blue-600 font-medium"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div
      key={userEmail}
      className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-hidden"
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm cursor-default"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
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
              Live mode turns on once your business has been verified (KYC).
              Until then you can keep testing with your sandbox key.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
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
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
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
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto py-5 px-4 space-y-6"
          aria-label="Dashboard"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.heading ?? "main"}>
              {group.heading && (
                <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {group.heading}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((entry) => {
                  const active = isActive(entry);
                  const Icon = entry.icon;
                  const content = (
                    <>
                      <Icon
                        className={`w-5 h-5 ${active ? "text-blue-600" : "text-slate-400"}`}
                      />
                      <span className="flex-1">{entry.label}</span>
                      {entry.soon && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                      {entry.external && (
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </>
                  );
                  return entry.external ? (
                    <Link
                      key={entry.to}
                      to={entry.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass(false)}
                    >
                      {content}
                    </Link>
                  ) : (
                    <Link
                      key={entry.to}
                      to={entry.to}
                      onClick={() => setIsSidebarOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={linkClass(active)}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3 shrink-0">
          {wallet && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Wallet balance</p>
              <p
                className={`text-sm font-semibold ${walletStatus === "empty" ? "text-red-600" : "text-slate-900"}`}
              >
                {formatNaira(Number(wallet.available))}
              </p>
              <Link
                to="/dashboard/billing"
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Add funds
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowLogoutPopup(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden text-slate-500 hover:text-slate-900 mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="ml-auto flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200">
              <span
                className={`text-[10px] sm:text-xs font-semibold transition-colors ${
                  merchantMode === "test" ? "text-amber-600" : "text-slate-400"
                }`}
              >
                Test
              </span>
              <button
                type="button"
                onClick={handleToggleMode}
                aria-label="Switch the dashboard between test and live data"
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  merchantMode === "live" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              >
                <span
                  className={`flex h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-sm transition-transform items-center justify-center ${
                    merchantMode === "live"
                      ? "translate-x-5 sm:translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-[10px] sm:text-xs font-semibold transition-colors ${
                  merchantMode === "live"
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                Live
              </span>
            </div>

            <Link
              to="/dashboard/settings"
              aria-label="Account settings"
              className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm"
            >
              {getInitials(userName)}
            </Link>
          </div>
        </header>

        {merchantMode !== "live" ? (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-xs sm:text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 shrink-0">
            <span>
              <strong>Test mode.</strong> You're viewing sandbox data. Nothing
              here moves real money.
            </span>
            {!accountLive ? (
              <Link
                to="/dashboard/settings"
                state={{ tab: "kyc" }}
                className="font-semibold underline underline-offset-2 hover:text-amber-700 whitespace-nowrap"
              >
                Complete KYC to go live
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleToggleMode}
                className="font-semibold underline underline-offset-2 hover:text-amber-700 cursor-pointer whitespace-nowrap"
              >
                View live data
              </button>
            )}
          </div>
        ) : (
          kycStatus === "pending" && (
            <div className="bg-blue-600 px-4 py-2 text-white text-xs sm:text-sm flex items-center justify-center gap-3 shrink-0">
              <span className="font-medium">
                Your account is pending verification.
              </span>
              <Link
                to="/dashboard/settings"
                state={{ tab: "kyc" }}
                className="bg-white text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-50 transition-colors text-xs whitespace-nowrap"
              >
                Complete KYC
              </Link>
            </div>
          )
        )}

        {walletStatus && (
          <div
            className={`px-4 py-2 text-white text-xs sm:text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 shrink-0 ${walletStatus === "empty" ? "bg-red-600" : "bg-amber-600"}`}
          >
            <span>
              {walletStatus === "empty" ? (
                <>
                  <strong>Live payments and payouts are paused.</strong> Your
                  wallet can't cover the fee for a new transaction.
                </>
              ) : (
                <>
                  <strong>Your wallet is running low.</strong> About{" "}
                  {wallet?.transactions_remaining} live transactions left.
                </>
              )}
            </span>
            <Link
              to="/dashboard/billing"
              className="bg-white text-slate-900 px-3 py-1 rounded-full font-semibold hover:bg-slate-100 transition-colors text-xs whitespace-nowrap"
            >
              Add funds
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
