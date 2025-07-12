import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const cookie = cookies();
    const userC = cookie.get("stackit_user_data");
    const user = userC ? JSON.parse(userC.value) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;
    const { description } = await request.json();
    const answerId = request.nextUrl.searchParams.get("answerId");
    const commentId = request.nextUrl.searchParams.get("commentId");

    if (!userId || !answerId || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if answer exists
    const answer = await prisma.answer.findUnique({
      where: { id: Number(answerId) },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // If commentId is provided, update existing comment
    if (commentId) {
      const existing = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      // Check if user owns the comment
      if (existing.userId !== String(userId)) {
        return NextResponse.json(
          { error: "Unauthorized to edit this comment" },
          { status: 403 }
        );
      }

      const updatedComment = await prisma.comment.update({
        where: { id: Number(commentId) },
        data: { description },
      });

      return NextResponse.json(
        { message: "Comment updated successfully", comment: updatedComment },
        { status: 200 }
      );
    }

    // Otherwise, create new comment
    const newComment = await prisma.comment.create({
      data: {
        userId: String(userId),
        answerId: Number(answerId),
        description,
      },
    });

    return NextResponse.json(
      { message: "Comment created successfully", comment: newComment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/comments error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, context: any) {
  try {
    const answerId = req.nextUrl.searchParams.get("answerId");

    if (!answerId) {
      return NextResponse.json(
        { error: "Answer ID is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { answerId: parseInt(answerId) },
      include: {
        user: true, // Include user details
      },
      orderBy: {
        createdAt: "asc", // Comments usually show oldest first
      },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
