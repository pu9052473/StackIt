import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const setCookie = req.nextUrl.searchParams.get("setCookie");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    console.log("Fetched user:", user);

    // For non-GoogleAuth normal fetches
    if (!user?.role) {
      return NextResponse.json(
        { message: "User role not found" },
        { status: 404 }
      );
    }
    const response = NextResponse.json(
      { user, role: user.role },
      { status: 200 }
    );

    if (setCookie === "true") {
      response.cookies.set("ideocity_user_data", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("GET /api/users/:userId error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Filter only fields with values (not undefined)
    const updateData: any = {};
    const allowedFields = [
      "profession",
      "age",
      "about",
      "socialLinks",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User profile updated", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/users/:userId", error);
    return NextResponse.json(
      {
        message: "Failed to update user",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
