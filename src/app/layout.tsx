// app/layout.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toogle";
import CustomAdminSideBar from "@/components/CustomAdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { QueryProvider } from "@/utils/QueryProvider";
import FloatingNotesCanvas from "./(module)/projects/_component/NotesCanvas";
import Navbar from "@/components/Navbar";

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
                  <SidebarProvider>
                    <CustomAdminSideBar />
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden max-w-[100vw] dark:bg-background-secondary bg-background-primary">
                      {/* Top bar with Theme toggle and Sidebar Trigger for mobile */}
                      <SidebarTrigger className="absolute top-4 left-4 z-50 md:hidden text-text-inverse dark:text-text-primary">
                        <button className="p-2 rounded-md border md:hidden">
                          <Menu className="w-5 h-5" />
                        </button>
                      </SidebarTrigger>
                      {/* <div className="fixed top-4 right-4 z-50">
                        <ThemeToggle />
                      </div> */}
                      {children}
                      <FloatingNotesCanvas />
                    </main>
                  </SidebarProvider>
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
