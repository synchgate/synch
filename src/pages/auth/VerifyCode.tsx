import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService, type VerifyOtpPayload } from "../../services/auth";

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { purpose?: string; email?: string } | null;

  const purpose = state?.purpose || "signup";
  const email = state?.email || "your email";
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpPayload) => authService.verifyOtp(data),
    onSuccess: (_, variables) => {
      if (purpose === "reset") {
        navigate("/auth/reset-password", {
          state: { email: variables.email, otp: variables.otp },
        });
      } else {
        setSuccessMsg("Verification successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login", {
            state: { message: "Account successfully verified. Please log in." },
          });
        }, 2000);
      }
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Invalid code. Please try again.";
      setError(errorMessage);
    },
  });

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...code];

    pastedData.forEach((char, index) => {
      if (/^[0-9]$/.test(char) && index < 6) {
        newCode[index] = char;
      }
    });

    setCode(newCode);

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;
    setError(null);

    if (email !== "your email") {
      verifyOtpMutation.mutate({
        email,
        purpose: purpose === "reset" ? "password" : "email",
        otp: fullCode,
      });
    } else {
      setError("No email found to verify. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">
      <Link
        to={purpose === "reset" ? "/auth/forgot-password" : "/auth/signup"}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>

      <div className="mb-10 text-center">
        <h1 className="font-['Outfit'] text-3xl font-bold mb-3 text-black">
          Check your email
        </h1>
        <p className="text-slate-600">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-800">{email}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-2 sm:gap-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors"
            />
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mt-6 text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200 mt-6 text-center">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={code.join("").length !== 6 || verifyOtpMutation.isPending}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-500/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all group cursor-pointer mt-8"
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
          {!verifyOtpMutation.isPending && (
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Didn't receive the email?{" "}
        <button className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer">
          Click to resend
        </button>
      </div>
    </div>
  );
}

export default VerifyCode;
