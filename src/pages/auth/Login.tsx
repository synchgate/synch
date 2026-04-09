import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService, type LoginPayload } from "../../services/auth";
import { queryClient } from "../../lib/react-query";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const stateMessage = (location.state as { message?: string })?.message;

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (data) => {
      queryClient.resetQueries();
      // Store token depending on your backend schema, falling back to a dummy identifier
      const token =
        data?.access || data?.token || data?.access_token || "authenticated";

      const fullName =
        data?.full_name ||
        data?.user?.full_name ||
        data?.user?.first_name ||
        "";

      const kycStatus = data?.kyc_status || data?.user?.kyc_status || "pending";

      const rawMerchantMode =
        data?.merchant_mode || data?.user?.merchant_mode || "sandbox";
      const merchantMode = rawMerchantMode === "live" ? "live" : "test";

      const email = data?.user?.email || data?.email || formData.email;
      login(token, email, fullName, kycStatus, merchantMode);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      // Extract error message from API response if possible
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-['Outfit'] text-3xl font-bold mb-3 text-black">
          Welcome back
        </h1>
        <p className="text-slate-600">
          Enter your credentials to access your account
        </p>
      </div>

      {stateMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-50/80 backdrop-blur-sm text-green-700 text-sm border border-green-200/50 flex flex-col items-center justify-center text-center">
          <span className="font-semibold">{stateMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-500/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors group cursor-pointer"
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
          {!loginMutation.isPending && (
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
        >
          Create free account
        </Link>
      </div>
    </div>
  );
}

export default Login;
