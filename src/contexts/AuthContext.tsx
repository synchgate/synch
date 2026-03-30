import { type ReactNode, createContext, useContext, useState, useEffect } from "react";
import { queryClient } from "../lib/react-query";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  kycStatus: string;
  merchantMode: string;
  login: (
    token: string,
    email?: string,
    name?: string,
    kycStatus?: string,
    merchantMode?: string,
  ) => void;
  logout: () => void;
  updateMerchantMode: (mode: string) => void;
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
  const [merchantMode, setMerchantMode] = useState<string>(() => {
    return localStorage.getItem("merchantMode") || "test";
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
        const remainingTime = (loginTime + TWENTY_THREE_HOURS) - currentTime;
        const timer = setTimeout(() => {
          console.log("⏰ AuthContext: Session timeout reached, logging out...");
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
      localStorage.setItem("merchantMode", merchantMode);
      setMerchantMode(merchantMode);
    }
    setIsAuthenticated(true);
  };

  const updateMerchantMode = (mode: string) => {
    localStorage.setItem("merchantMode", mode);
    setMerchantMode(mode);
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
        merchantMode,
        login,
        logout,
        updateMerchantMode,
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
