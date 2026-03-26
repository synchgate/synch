import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch custom event for AuthContext to handle React state sync
      window.dispatchEvent(new Event("auth-unauthorized"));

      // Clear auth tokens securely when API rejects session
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("kycStatus");
      localStorage.removeItem("merchantMode");
      localStorage.removeItem("authTimestamp");

      // Redirect to login if not already there
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);
