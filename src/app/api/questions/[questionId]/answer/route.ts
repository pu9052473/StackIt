import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: any) {
  try {
    const cookie = cookies();
    const userC = cookie.get("stackit_user_data");
    const user = userC ? JSON.parse(userC.value) : null;
    console.log("user", user)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId } = await context.params;
    console.log("questionId", questionId)

    const userId = user?.id;

    const { description } = await request.json();
    console.log("description", description)

    const answerId = request.nextUrl.searchParams.get("answerId");

    if (!userId || !questionId || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
    });
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // If `answerId` is provided, update existing answer
    if (answerId) {
      const existing = await prisma.answer.findUnique({
        where: { id: Number(answerId) },
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }

      const updatedAnswer = await prisma.answer.update({
        where: { id: Number(answerId) },
        data: { description },
      });

      return NextResponse.json(
        { message: "Answer updated successfully", answer: updatedAnswer },
        { status: 200 }
      );
    }

    // Otherwise, create new answer
    const newAnswer = await prisma.answer.create({
      data: {
        userId: String(userId),
        questionId: Number(questionId),
        description,
      },
    });

    return NextResponse.json(
      { message: "Answer created successfully", answer: newAnswer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/answers error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get("questionId");

  try {
    if (questionId) {
      const answers = await prisma.answer.findMany({
        where: { questionId: parseInt(questionId) },
        include: {
          user: true, // Include user details
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ answers }, { status: 200 });
    }

    const answers = await prisma.answer.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ answers }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/answers error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
