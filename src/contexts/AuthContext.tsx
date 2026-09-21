import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { queryClient } from "../lib/react-query";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  kycStatus: string;
  /** Whether KYC approval has made this account live. Decided by the server, never by the user. */
  accountLive: boolean;
  /** Which dashboard is showing, "test" or "live". Only a view: it never changes the account. */
  merchantMode: string;
  login: (
    token: string,
    email?: string,
    name?: string,
    kycStatus?: string,
    merchantMode?: string,
  ) => void;
  logout: () => void;
  /** Which dashboard to show. Live is refused unless the account is live. */
  updateMerchantMode: (mode: string) => void;
  /** Takes the account's real status from the server. */
  syncAccount: (account: { kycStatus?: string; accountLive?: boolean }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("authToken");
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("userName") || "";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "";
  });
  const [kycStatus, setKycStatus] = useState<string>(() => {
    return localStorage.getItem("kycStatus") || "";
  });
  const [accountLive, setAccountLive] = useState<boolean>(() => {
    const stored = localStorage.getItem("accountLive");
    if (stored !== null) return stored === "true";
    // A session from before this was tracked: what was stored then was the account's mode.
    return localStorage.getItem("merchantMode") === "live";
  });
  const [merchantMode, setMerchantMode] = useState<string>(() => {
    const view = localStorage.getItem("merchantMode") || "test";
    const live =
      localStorage.getItem("accountLive") === "true" ||
      (localStorage.getItem("accountLive") === null && view === "live");
    return live && view === "live" ? "live" : "test";
  });

  useEffect(() => {
    const checkExpiration = () => {
      const authTimestamp = localStorage.getItem("authTimestamp");
      if (authTimestamp && isAuthenticated) {
        const loginTime = parseInt(authTimestamp, 10);
        const currentTime = Date.now();
        const TWENTY_THREE_HOURS = 23 * 60 * 60 * 1000;

        if (currentTime - loginTime >= TWENTY_THREE_HOURS) {
          console.log("⏰ AuthContext: Session expired (23h), logging out...");
          logout();
          return;
        }

        // Schedule next check/logout
        const remainingTime = loginTime + TWENTY_THREE_HOURS - currentTime;
        const timer = setTimeout(() => {
          console.log(
            "⏰ AuthContext: Session timeout reached, logging out...",
          );
          logout();
        }, remainingTime);

        return () => clearTimeout(timer);
      }
    };

    const cleanup = checkExpiration();
    if (typeof cleanup === "function") return cleanup;
  }, [isAuthenticated]);

  const login = (
    token: string,
    email?: string,
    name?: string,
    kycStatus?: string,
    merchantMode?: string,
  ) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTimestamp", Date.now().toString());
    if (email) {
      localStorage.setItem("userEmail", email);
      setUserEmail(email);
    }
    if (name) {
      localStorage.setItem("userName", name);
      setUserName(name);
    }
    if (kycStatus) {
      localStorage.setItem("kycStatus", kycStatus);
      setKycStatus(kycStatus);
    }
    if (merchantMode) {
      // What the server says about the account. A live account opens on the live dashboard.
      const live = merchantMode === "live";
      localStorage.setItem("accountLive", String(live));
      setAccountLive(live);
      const view = live ? "live" : "test";
      localStorage.setItem("merchantMode", view);
      setMerchantMode(view);
    }
    setIsAuthenticated(true);
  };

  const updateMerchantMode = (mode: string) => {
    if (mode === "live" && !accountLive) return;
    localStorage.setItem("merchantMode", mode);
    setMerchantMode(mode);
  };

  const syncAccount = ({
    kycStatus: kyc,
    accountLive: live,
  }: {
    kycStatus?: string;
    accountLive?: boolean;
  }) => {
    if (kyc) {
      localStorage.setItem("kycStatus", kyc);
      setKycStatus(kyc);
    }
    if (live !== undefined) {
      localStorage.setItem("accountLive", String(live));
      setAccountLive(live);
      if (!live) {
        // Approval was withdrawn, so there is no live dashboard to look at.
        localStorage.setItem("merchantMode", "test");
        setMerchantMode("test");
      }
    }
  };

  const logout = () => {
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.resetQueries();
    localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        userEmail,
        kycStatus,
        accountLive,
        merchantMode,
        login,
        logout,
        updateMerchantMode,
        syncAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
