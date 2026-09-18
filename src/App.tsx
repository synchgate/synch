import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { queryClient } from "./lib/react-query";
import AuthLayout from "./pages/auth/AuthLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import VerifyCode from "./pages/auth/VerifyCode";
import ContactUs from "./pages/ContactUs";

// The dashboard and docs are large, so they load only when someone opens them.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));
const Billing = lazy(() => import("./pages/dashboard/Billing"));
const Logs = lazy(() => import("./pages/dashboard/Logs"));
const MyApiKey = lazy(() => import("./pages/dashboard/MyApiKey"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const Providers = lazy(() => import("./pages/dashboard/Providers"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const SupportTicket = lazy(() => import("./pages/dashboard/SupportTicket"));
const Transactions = lazy(() => import("./pages/dashboard/Transactions"));
const Authentication = lazy(() => import("./pages/docs/Authentication"));
const BanksApi = lazy(() => import("./pages/docs/BanksApi"));
const DataPrivacy = lazy(() => import("./pages/docs/DataPrivacy"));
const Errors = lazy(() => import("./pages/docs/Errors"));
const InitiatePayment = lazy(() => import("./pages/docs/InitiatePayment"));
const InitiateTransfer = lazy(() => import("./pages/docs/InitiateTransfer"));
const Installation = lazy(() => import("./pages/docs/Installation"));
const Introduction = lazy(() => import("./pages/docs/Introduction"));
const PCICompliance = lazy(() => import("./pages/docs/PCICompliance"));
const ResolveAccount = lazy(() => import("./pages/docs/ResolveAccount"));
const SmartRoutes = lazy(() => import("./pages/docs/SmartRoutes"));
const TransactionVerification = lazy(
  () => import("./pages/docs/TransactionVerification"),
);

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
  </div>
);

import DemoPage from "./pages/DemoPage";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import TermsOfUse from "./pages/TermsOfUse";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route
                path="/contact-us"
                element={
                  <PublicRoute>
                    <ContactUs />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="providers" element={<Providers />} />
                <Route path="logs" element={<Logs />} />
                <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
                <Route path="api-keys" element={<MyApiKey />} />
                <Route path="support-ticket" element={<SupportTicket />} />
              </Route>

              <Route path="/docs" element={<DocsPage />}>
                <Route index element={<Introduction />} />
                <Route
                  path="introduction"
                  element={<Navigate to="/docs" replace />}
                />
                <Route path="installation" element={<Installation />} />
                <Route path="authentication" element={<Authentication />} />
                <Route path="errors" element={<Errors />} />
                <Route path="initiate-payment" element={<InitiatePayment />} />
                <Route path="smart-routes" element={<SmartRoutes />} />
                <Route
                  path="transaction-verification"
                  element={<TransactionVerification />}
                />
                <Route path="banks" element={<BanksApi />} />
                <Route path="resolve-account" element={<ResolveAccount />} />
                <Route
                  path="initiate-transfer"
                  element={<InitiateTransfer />}
                />
                <Route path="pci-compliance" element={<PCICompliance />} />
                <Route path="data-privacy" element={<DataPrivacy />} />
              </Route>

              <Route path="/terms-of-use" element={<TermsOfUse />} />

              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <AuthLayout />
                  </PublicRoute>
                }
              >
                <Route index element={<Navigate to="login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="verify" element={<VerifyCode />} />
                <Route path="reset-password" element={<ResetPassword />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
