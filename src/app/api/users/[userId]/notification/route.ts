import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

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

    return NextResponse.json(
        { message: "Notification fetched", notifications },
        { status: 400 }
      );
  } catch (error: any) {
    console.error("GET /api/users/:userId/notification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}