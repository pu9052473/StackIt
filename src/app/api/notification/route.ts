import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookie = cookies();
    const userC = cookie.get("stackit_user_data");
    const user = userC ? JSON.parse(userC.value) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get("userId");

    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: String(userId) },
      include: { question: true },
    });

    console.log("Fetched notifications:", notifications);

    return NextResponse.json(
      { message: "Notification fetched", notifications },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/users/:userId/notification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, questionId, description } = body;

    console.log("Received data:", body);

    if (!questionId || !description || !userId) {
      return NextResponse.json(
        { error: "Missing userId, questionId, or description" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        questionId,
        description,
      },
    });

    return NextResponse.json(
      { message: "Notification created", notification },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users/:userId/notification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
