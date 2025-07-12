"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Prisma, ROLE } from "@prisma/client";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cookie configuration
const USER_COOKIE_NAME = "stackit_user_data";
const COOKIE_EXPIRY_DAYS = 7;
type UserWithRelations = Prisma.UserGetPayload<{}>;

type UserType = {
  id: string;
  email: string;
  userName: string;
  role: ROLE;
} | null;

const AuthContext = createContext<{
  user: UserType;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserDataFromCookie = (): UserWithRelations | null => {
    try {
      const cookieData = Cookies.get(USER_COOKIE_NAME);
      if (cookieData) {
        return JSON.parse(cookieData);
      }
    } catch (error) {
      console.error("Failed to parse user data from cookie:", error);
      Cookies.remove(USER_COOKIE_NAME);
    }
    return null;
  };
  const saveUserDataToCookie = (userData: UserWithRelations) => {
    try {
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
        expires: COOKIE_EXPIRY_DAYS,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Failed to save user data to cookie:", error);
    }
  };
  const fetchUser = async () => {
    const user = getUserDataFromCookie();
    if (user) {
      setUser({
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
      });
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      saveUserDataToCookie(data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUser(); // refetch user from server and set cookie
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    Cookies.remove(USER_COOKIE_NAME);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
