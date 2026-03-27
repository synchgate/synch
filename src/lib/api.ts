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
      // Clear all storage and refresh to login page
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);
