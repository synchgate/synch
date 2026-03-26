import { type ReactNode, createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  kycStatus: string;
  merchantMode: string;
  login: (
    token: string,
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
          logout();
          return true;
        }
        
        // Schedule next check/logout
        const remainingTime = (loginTime + TWENTY_THREE_HOURS) - currentTime;
        const timer = setTimeout(() => {
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
    name?: string,
    kycStatus?: string,
    merchantMode?: string,
  ) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTimestamp", Date.now().toString());
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("kycStatus");
    localStorage.removeItem("merchantMode");
    localStorage.removeItem("authTimestamp");
    setIsAuthenticated(false);
    setUserName("");
    setKycStatus("");
    setMerchantMode("test");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
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
