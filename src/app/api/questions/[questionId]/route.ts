import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
  const { questionId } = await context.params;
  const question = await prisma.question.findUnique({
    where: { id: Number(questionId) },
    include: {
      answer: {
        include: {
          user: true,
        },
      },
    },
  });
  console.log(question);
  return NextResponse.json(
    { message: "Found Question", question },
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest) {
  try {
    const cookie = cookies();
    const userC = cookie.get("stackit_user_data");
    const user = userC ? JSON.parse(userC.value) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const deletedQuestion = await prisma.question.delete({
      where: { id: Number(questionId) },
      include: {
        answer: {
          include: {
            user: true,
            comment: true,
          },
        },
      },
    });
    return NextResponse.json(deletedQuestion);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
