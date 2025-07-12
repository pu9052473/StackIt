// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   BrainCircuit,
//   Home,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Sparkles,
//   Shield,
//   Zap,
//   Mail,
//   Lock,
//   Loader2,
//   Code,
//   Database,
//   Cpu,
//   Network,
//   Layers,
//   Globe,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import GoogleLogo from "../../../../public/Google_Favicon_2025.webp";
// import { signInWithEmail } from "@/lib/auth/signInWithEmail";
// import { signInWithGoogle } from "@/lib/auth/signInWithGoogle";
// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedField, setFocusedField] = useState("");
//   const router = useRouter();

//   const handleGoogleSignUp = async () => {
//     try {
//       await signInWithGoogle(); // redirects to Google
//       toast.success("Redirecting to Google...");
//     } catch (error: any) {
//       toast.error(error.message || "Google sign-in failed.");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please enter both email and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       const user = await signInWithEmail(email, password);
//       if (user.user_metadata.role === "ADMIN") {
//         router.push("/admin");
//       } else {
//         router.push("/projects");
//       }
//       toast.success("Logged in successfully");
//     } catch (error: any) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background Icons */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-10">
//         <BrainCircuit className="absolute top-10 left-10 w-16 h-16 text-primary animate-pulse" />
//         <Code
//           className="absolute top-1/4 right-20 w-12 h-12 text-blue-500 animate-bounce"
//           style={{ animationDelay: "0.5s" }}
//         />
//         <Database
//           className="absolute bottom-20 left-1/4 w-14 h-14 text-green-500 animate-pulse"
//           style={{ animationDelay: "1s" }}
//         />
//         <Cpu
//           className="absolute top-1/3 left-1/3 w-10 h-10 text-purple-500 animate-bounce"
//           style={{ animationDelay: "1.5s" }}
//         />
//         <Network
//           className="absolute bottom-1/3 right-1/3 w-12 h-12 text-orange-500 animate-pulse"
//           style={{ animationDelay: "2s" }}
//         />
//         <Layers
//           className="absolute top-1/2 right-10 w-11 h-11 text-red-500 animate-bounce"
//           style={{ animationDelay: "2.5s" }}
//         />
//         <Globe
//           className="absolute bottom-10 right-1/4 w-13 h-13 text-cyan-500 animate-pulse"
//           style={{ animationDelay: "3s" }}
//         />
//         <Zap
//           className="absolute top-20 right-1/2 w-9 h-9 text-yellow-500 animate-bounce"
//           style={{ animationDelay: "3.5s" }}
//         />
//         <Shield
//           className="absolute bottom-1/4 left-10 w-15 h-15 text-indigo-500 animate-pulse"
//           style={{ animationDelay: "4s" }}
//         />
//         <Sparkles
//           className="absolute top-3/4 left-1/2 w-8 h-8 text-pink-500 animate-bounce"
//           style={{ animationDelay: "4.5s" }}
//         />
//       </div>

//       {/* Gradient Orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-primary/10 via-transparent to-primary/10 rounded-full blur-3xl animate-spin-slow opacity-30"></div>
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           {/* Logo */}
//           <div className="flex justify-center mb-6">
//             <div className="relative">
//               <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25">
//                 <BrainCircuit className="h-10 w-10 text-white" />
//               </div>
//               <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
//                 <Sparkles className="w-4 h-4 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Brand Name */}
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Make<span className="text-primary">It</span>
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Innovation starts with a single sign-in
//             </p>
//           </div>

//           {/* Navigation Links */}
//           <div className="flex items-center justify-center gap-6 mb-8">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group"
//             >
//               <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
//               Back to Home
//             </Link>
//             <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
//             <Link
//               href="/signup"
//               className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
//             >
//               Create account
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//             </Link>
//           </div>
//         </div>

//         {/* Login Card */}
//         <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl shadow-gray-900/10 dark:shadow-black/25">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               Welcome Back
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               Sign in to continue your journey
//             </p>
//           </div>

//           {/* Google Sign In */}
//           <button
//             onClick={handleGoogleSignUp}
//             type="button"
//             className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
//           >
//             <Image
//               height={20}
//               width={20}
//               src={GoogleLogo}
//               alt="G"
//               className="w-5 h-5"
//             />
//             <span className="font-medium text-gray-700 dark:text-gray-300">
//               Continue with Google
//             </span>
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
//             <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
//               or continue with email
//             </span>
//             <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Email address
//               </Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail
//                     className={`h-5 w-5 transition-colors ${
//                       focusedField === "email"
//                         ? "text-primary"
//                         : "text-gray-400 dark:text-gray-500"
//                     }`}
//                   />
//                 </div>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onFocus={() => setFocusedField("email")}
//                   onBlur={() => setFocusedField("")}
//                   placeholder="you@example.com"
//                   className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Password
//               </Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock
//                     className={`h-5 w-5 transition-colors ${
//                       focusedField === "password"
//                         ? "text-primary"
//                         : "text-gray-400 dark:text-gray-500"
//                     }`}
//                   />
//                 </div>
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onFocus={() => setFocusedField("password")}
//                   onBlur={() => setFocusedField("")}
//                   placeholder="Enter your password"
//                   className="pl-10 pr-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Forgot Password */}
//             <div className="text-right">
//               <Link
//                 href="/forgot-password"
//                 className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Signing in...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center gap-2">
//                   <span>Sign In</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </div>
//               )}
//             </Button>
//           </form>
//         </div>

//         {/* Trust Indicator */}
//         <div className="text-center mt-8">
//           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
//             <Shield className="w-4 h-4" />
//             Enterprise-grade security • SOC 2 compliant • 256-bit encryption
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

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
import logo_dark from "../../../../public/logo_dark.svg";
import logo_light from "../../../../public/logo_light.svg";

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
        router.push("/projects");
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
