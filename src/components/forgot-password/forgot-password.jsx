import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
import { FORGOTPASSWORD } from "@/constants/apiConstants";

const getCSSVariable = (variable) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [step, setStep] = useState("input");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { trigger: ForgotPassword, loading } = useApiMutation();

  const colors = {
    background: `hsl(${getCSSVariable("--background")})`,
    foreground: `hsl(${getCSSVariable("--foreground")})`,
    card: `hsl(${getCSSVariable("--card")})`,
    cardForeground: `hsl(${getCSSVariable("--card-foreground")})`,
    primary: `hsl(${getCSSVariable("--primary")})`,
    primaryForeground: `hsl(${getCSSVariable("--primary-foreground")})`,
    secondary: `hsl(${getCSSVariable("--secondary")})`,
    secondaryForeground: `hsl(${getCSSVariable("--secondary-foreground")})`,
    muted: `hsl(${getCSSVariable("--muted")})`,
    mutedForeground: `hsl(${getCSSVariable("--muted-foreground")})`,
    border: `hsl(${getCSSVariable("--border")})`,
    input: `hsl(${getCSSVariable("--input")})`,
    destructive: `hsl(${getCSSVariable("--destructive")})`,
  };

  const handleSubmit = async () => {
    if (!email.trim() && !username.trim()) {
      setStep("error");
      setMessage("Please enter your email or username");
      return;
    }

    try {
      const res = await ForgotPassword({
        url: FORGOTPASSWORD.sendPasswordReset,
        method: "POST",
        data: { email: email.trim(), username: username.trim() },
      });
      if (res.code == 201) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep("success");
        setMessage(res.message || "Password reset link sent successfully!");
        setEmail("");
        setUsername("");
      } else {
        setStep("error");
        setMessage(
          res.message ||
            "An error occurred. Please check your connection and try again."
        );
      }
    } catch (error) {
      setStep("error");
      setMessage(
        "An error occurred. Please check your connection and try again."
      );
    }
  };

  const resetForm = () => {
    setStep("input");
    setEmail("");
    setUsername("");
    setMessage("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.card} 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30"
          style={{ background: colors.primary }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: colors.secondary }}
        ></div>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-lg shadow-xl p-8 backdrop-blur-sm border"
          style={{
            background: colors.card,
            borderColor: colors.border,
          }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="flex justify-center mb-4 w-12 h-12 rounded-full mx-auto"
              style={{ background: colors.primary, opacity: 0.1 }}
            >
              <Lock className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: colors.cardForeground }}
            >
              Reset Password
            </h1>
            <p className="text-sm" style={{ color: colors.mutedForeground }}>
              Enter your email or username to receive a password reset link
            </p>
          </div>

          {step === "input" && (
            <div className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium"
                  style={{ color: colors.cardForeground }}
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      borderColor: colors.border,
                      color: colors.cardForeground,
                    }}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 placeholder-gray-400"
                    onFocus={(e) =>
                      (e.target.style.borderColor = colors.primary)
                    }
                    onBlur={(e) => (e.target.style.borderColor = colors.border)}
                  />
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: colors.border }}
                ></div>
                <span
                  className="text-xs font-medium"
                  style={{ color: colors.mutedForeground }}
                >
                  OR
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: colors.border }}
                ></div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium"
                  style={{ color: colors.cardForeground }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3.5 w-5 h-5"
                    style={{ color: colors.mutedForeground }}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      borderColor: colors.border,
                      color: colors.cardForeground,
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 placeholder-gray-400"
                    onFocus={(e) =>
                      (e.target.style.borderColor = colors.primary)
                    }
                    onBlur={(e) => (e.target.style.borderColor = colors.border)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: loading ? `${colors.primary}b3` : colors.primary,
                  color: colors.primaryForeground,
                }}
                className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: `${colors.primaryForeground} ${colors.primaryForeground} transparent ${colors.primaryForeground}`,
                      }}
                    ></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Password
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p
                className="text-center text-sm"
                style={{ color: colors.mutedForeground }}
              >
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="font-medium hover:underline bg-none border-none p-0 cursor-pointer"
                  style={{ color: colors.primary }}
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <div
                className="flex justify-center"
                style={{
                  color: "hsl(120, 100%, 40%)",
                }}
              >
                <CheckCircle2 className="w-16 h-16 animate-bounce" />
              </div>
              <div>
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.cardForeground }}
                >
                  Check Your Email!
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: colors.mutedForeground }}
                >
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions.
                </p>
                <p
                  className="text-xs"
                  style={{ color: colors.mutedForeground }}
                >
                  Didn't receive the email? Check your spam folder.
                </p>
              </div>
              <button
                onClick={resetForm}
                style={{
                  background: colors.primary,
                  color: colors.primaryForeground,
                }}
                className="w-full py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Try Another Account
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center space-y-6">
              <div
                className="flex justify-center"
                style={{
                  color: colors.destructive,
                }}
              >
                <AlertCircle className="w-16 h-16" />
              </div>
              <div>
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.cardForeground }}
                >
                  Oops!
                </h2>
                <p
                  className="text-sm"
                  style={{ color: colors.mutedForeground }}
                >
                  {message}
                </p>
              </div>
              <button
                onClick={resetForm}
                style={{
                  background: colors.primary,
                  color: colors.primaryForeground,
                }}
                className="w-full py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: colors.mutedForeground }}
        >
          Need help?{" "}
          <button
            onClick={() => console.log("Contact support")}
            className="font-medium hover:underline bg-none border-none p-0 cursor-pointer"
            style={{ color: colors.primary }}
          >
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
