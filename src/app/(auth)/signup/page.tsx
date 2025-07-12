"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import GoogleLogo from "../../../../public/Google_Favicon_2025.webp";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signInWithGoogle, signUpWithEmail } from "@/lib/auth/signInWithGoogle";
import { useQuery } from "@tanstack/react-query";

const fetchUserData = async () => {
  const response = await fetch(`/api/users?onlyUserName=true`);
  if (!response.ok) throw new Error("Failed to fetch user data");
  const data = await response.json();
  return data.users || [];
};

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUserData(),
    enabled: true,
  });

  const router = useRouter();

  useEffect(() => {
    if (!name || !userData) {
      setNameError("");
      return;
    }

    const alreadyTaken = userData.some(
      (user: { id: string; userName: string }) =>
        user.userName.toLowerCase() === name.toLowerCase()
    );

    if (alreadyTaken) {
      setNameError("Username is already taken");
    } else {
      setNameError("");
    }
  }, [name, userData]);

  console.log(userData)

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    if (nameError) {
      toast.error("Please choose a different username.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const user = await signUpWithEmail(email, password, name);
      if (user?.user && user.user.user_metadata.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/quesions");
      }
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-card dark:bg-card-dark p-8 rounded-xl shadow-md border border-border-light dark:border-border">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-text-inverse dark:text-text-primary">
            Create Your Account
          </h1>
          <p className="text-sm text-text-secondary dark:text-foreground-muted">
            Start your innovation journey today
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border-light dark:border-border bg-white dark:bg-background transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Image src={GoogleLogo} height={20} width={20} alt="G" />
          <span className="text-sm text-text-inverse dark:text-text-primary">
            Continue with Google
          </span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">User Name</Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="pl-10"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
            </div>
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-foreground-muted"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-foreground-muted"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-text-secondary dark:text-foreground-muted">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-sm text-center">
          <span className="text-text-secondary dark:text-foreground-muted">
            Already have an account?
          </span>{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
