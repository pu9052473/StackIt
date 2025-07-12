"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const publicRoutes = ["/early-access","/","/signup","/login"];
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  if (!publicRoutes.includes(pathName)) {
    if (!user) {
      router.push("/login");
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
