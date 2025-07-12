"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import GoogleLogo from "../../../../public/Google_Favicon_2025.webp";
import { signInWithEmail } from "@/lib/auth/signInWithEmail";
import { signInWithGoogle } from "@/lib/auth/signInWithGoogle";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast.success("Redirecting to Google...");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const user = await signInWithEmail(email, password);
      if (user.user_metadata.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/quesions");
      }
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary dark:bg-background-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-inverse dark:text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-2">
            Sign in to continue your journey
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-card dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
        >
          <Image src={GoogleLogo} height={20} width={20} alt="G" />
          <span className="text-sm font-medium text-text-inverse dark:text-text-primary">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="text-sm text-text-secondary font-medium">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-text-inverse"
            >
              Email address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className={`h-5 w-5 transition-colors ${
                    focusedField === "email"
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                placeholder="you@example.com"
                className="pl-10 h-12 bg-card dark:bg-card-dark border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-text-inverse"
            >
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 transition-colors ${
                    focusedField === "password"
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-12 bg-card dark:bg-card-dark border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-inverse"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Bottom Text */}
        <div className="text-center text-sm mt-4 text-text-secondary">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
