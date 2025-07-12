import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  // Public routes accessible without login
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/callback",
    "/api/auth/session",
    "/about",
    "/privacypolicy",
    "/termsandconditions",
    "/usepolicy",
    "/api/auth/callback",
  ];
  const isPublicApiUserRoute = pathname.startsWith("/api/users");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // If the user is logged in and tries to access login or signup, redirect to home
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL(
        user.user_metadata.role == "USER" ? "/projects" : "/admin",
        request.url
      )
    );
  }
  // If the user is not logged in and is not visiting a public route or public API route, redirect to login
  if (!user && !publicRoutes.includes(pathname) && !isPublicApiUserRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user tries to access /admin but is not an admin
  if (pathname.startsWith("/admin") && user?.user_metadata.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Matches all except Next.js internals
};
