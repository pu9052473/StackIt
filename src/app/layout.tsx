// app/layout.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";import { ThemeToggle } from "@/components/theme-toogle";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { QueryProvider } from "@/utils/QueryProvider";
import Navbar from "@/components/Navbar";
import { Breadcrumbs } from "@/components/BreadCumbs";

export const metadata = {
  title: "IdeoCity",
  description: "Validate and build your product ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {/* <ProtectedRoute> */}
            <TooltipProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster position="top-right" />
                <div className="flex min-h-screen w-full">
                    <Navbar />
                    <main className="mt-16 flex-1 overflow-x-hidden max-w-[100vw] dark:bg-background-secondary bg-background-primary">
                        <Breadcrumbs />
                      {children}
                    </main>
                </div>
              </ThemeProvider>
            </TooltipProvider>
            {/* </ProtectedRoute> */}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
