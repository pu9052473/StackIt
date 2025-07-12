// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/utils/QueryProvider";
import Navbar from "@/components/Navbar";
import { Breadcrumbs } from "@/components/BreadCumbs";

export const metadata = {
  title: "StackIt",
  description:
    "StackIt is a minimal and user-friendly Q&A platform that enables collaborative learning and structured knowledge sharing within a focused community.",
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
            {/* </ProtectedRoute> */}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
