"use client";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthLoader = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      // 1. Get the full URL
      const url = new URL(window.location.href);

      // 2. Get `code` from query
      const code = url.searchParams.get("code");

      // 3. If no `code`, try getting `access_token` from hash
      const hash = new URLSearchParams(window.location.hash.slice(1)); // remove the '#' prefix
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      // 4. Send either one to the backend
      axios
        .get("/api/auth/callback", {
          params: {
            code: code ?? null,
            access_token: accessToken ?? null,
            refreshToken: refreshToken ?? null,
          },
        })
        .then((res) => {
          router.push(res.data.user.role?.admin ? "/admin" : "/projects");
        })
        .catch((err) => {
          console.error("Failed to send code or token:", err);
        });
    }, 1000); // 1000 ms delay (1 second)

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-sm shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          {/* Google Icon Style */}
          <svg
            className="w-10 h-10 text-[#4285F4] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Signing you in
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we sign you in with Google
          </p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center mt-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#4285F4] rounded-full animate-spin"></div>
        </div>

        {/* Security Message */}
        <div className="text-xs text-gray-400 mt-6 text-center">
          Your data is encrypted and secure.
        </div>
      </div>
    </div>
  );
};

export default AuthLoader;
