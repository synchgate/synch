import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, type RegisterPayload } from "../../services/auth";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    business_name: "",
    email: "",
    business_phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const password = formData.password || "";
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid = Object.values(checks).every(Boolean);

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: () => {
      // Navigate to verification on successful registration
      navigate("/auth/verify", {
        state: { purpose: "signup", email: formData.email },
      });
    },
    onError: (err: any) => {
      // Extract specific error messages from the API payload
      const data = err.response?.data;
      let errorMessage = "Registration failed. Please try again.";

      if (data) {
        if (typeof data === "string") {
          errorMessage = data;
        } else if (data.email && Array.isArray(data.email)) {
          errorMessage = data.email[0];
        } else if (data.business_name && Array.isArray(data.business_name)) {
          errorMessage = data.business_name[0];
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.error) {
          errorMessage = data.error;
        } else {
          // Fallback: Get the first available error message from any field
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = String(firstError[0]);
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        }
      }
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

    // Business Name Validation (Min 6 characters)
    if (formData.business_name.length < 6) {
      setError("Business name must be at least 6 characters long.");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Please ensure your password meets all the security requirements.",
      );
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Use to sign up.");
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 mt-14 text-center">
        <h1 className="font-['Outfit'] text-3xl font-bold mb-3 text-black">
          Create your account
        </h1>
        <p className="text-slate-600">
          Start integrating payment providers in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
                placeholder="Jane"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                name="business_phone"
                value={formData.business_phone}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
        </div>

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
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
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

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isPasswordFocused
                ? "max-h-64 mt-3 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 text-xs font-medium">
              <div
                className={`flex items-center gap-2 ${checks.uppercase ? "text-emerald-600" : "text-slate-500"}`}
              >
                {checks.uppercase ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>At least one uppercase letter</span>
              </div>
              <div
                className={`flex items-center gap-2 ${checks.lowercase ? "text-emerald-600" : "text-slate-500"}`}
              >
                {checks.lowercase ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>At least one lowercase letter</span>
              </div>
              <div
                className={`flex items-center gap-2 ${checks.number ? "text-emerald-600" : "text-slate-500"}`}
              >
                {checks.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>At least one number</span>
              </div>
              <div
                className={`flex items-center gap-2 ${checks.symbol ? "text-emerald-600" : "text-slate-500"}`}
              >
                {checks.symbol ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>At least one symbol</span>
              </div>
              <div
                className={`flex items-center gap-2 ${checks.length ? "text-emerald-600" : "text-slate-500"}`}
              >
                {checks.length ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>At least 8 characters long</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
            />
          </div>
          <div className="text-sm">
            <label
              htmlFor="terms"
              className="font-medium text-slate-700 cursor-pointer"
            >
              I agree to the{" "}
            </label>
            <Link
              to="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              terms of use
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm shadow-black/10 text-sm font-semibold text-white bg-black hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors group cursor-pointer"
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create Account"}
          {!registerMutation.isPending && (
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}

export default Signup;
