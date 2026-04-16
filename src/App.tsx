import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ALLOW_FEATURE } from "./config/features";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { queryClient } from "./lib/react-query";
import AuthLayout from "./pages/auth/AuthLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import VerifyCode from "./pages/auth/VerifyCode";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import DocsPage from "./pages/DocsPage";
import Analytics from "./pages/dashboard/Analytics";
import Billings from "./pages/dashboard/Billings";
import InvoiceHistory from "./pages/dashboard/InvoiceHistory";
import Logs from "./pages/dashboard/Logs";
import MyApiKey from "./pages/dashboard/MyApiKey";
import Overview from "./pages/dashboard/Overview";
import Providers from "./pages/dashboard/Providers";
import Settings from "./pages/dashboard/Settings";
import SupportTicket from "./pages/dashboard/SupportTicket";
import Transactions from "./pages/dashboard/Transactions";
import Authentication from "./pages/docs/Authentication";
import BanksApi from "./pages/docs/BanksApi";
import DataPrivacy from "./pages/docs/DataPrivacy";
import InitiatePayment from "./pages/docs/InitiatePayment";
import InitiateTransfer from "./pages/docs/InitiateTransfer";
import Installation from "./pages/docs/Installation";
import Introduction from "./pages/docs/Introduction";
import PCICompliance from "./pages/docs/PCICompliance";
import ResolveAccount from "./pages/docs/ResolveAccount";
import TransactionVerification from "./pages/docs/TransactionVerification";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import DemoPage from "./pages/DemoPage";
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
              <Route path="settings" element={<Settings />} />
              <Route path="api-keys" element={<MyApiKey />} />
              {ALLOW_FEATURE && (
                <>
                  <Route path="billings" element={<Billings />} />
                  <Route path="billings/history" element={<InvoiceHistory />} />
                </>
              )}
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
              <Route path="initiate-payment" element={<InitiatePayment />} />
              <Route
                path="transaction-verification"
                element={<TransactionVerification />}
              />
              <Route path="banks" element={<BanksApi />} />
              <Route path="resolve-account" element={<ResolveAccount />} />
              <Route path="initiate-transfer" element={<InitiateTransfer />} />
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
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
