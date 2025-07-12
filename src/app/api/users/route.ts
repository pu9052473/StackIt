import { createUser } from "@/lib/api-handlers";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const setCookie = request.nextUrl.searchParams.get("setCookie");
    const { id, email, role, name } = data;

    if (!id || !email || !role || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) {
      const response = NextResponse.json(
        { message: "User created", existingUser },
        { status: 200 }
      );
      const cookieStore = cookies();
      const existingCookie = cookieStore.get("ideocity_user_data");

      if (setCookie === "true" && !existingCookie) {
        response.cookies.set(
          "ideocity_user_data",
          JSON.stringify(existingUser),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
          }
        );
        console.log(
          "🔐 Cookie set on server for existingUser:",
          existingUser.email
        );
      }

      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }

    const user = await createUser({ id, email, role, name });
    const response = NextResponse.json(
      { message: "User created", user },
      { status: 200 }
    );
    const cookieStore = cookies();
    const existingCookie = cookieStore.get("ideocity_user_data");

    if (setCookie === "true" && !existingCookie) {
      response.cookies.set("ideocity_user_data", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      console.log("🔐 Cookie set on server for user:", user.email);
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
