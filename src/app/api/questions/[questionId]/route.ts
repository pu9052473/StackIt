import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId");
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
  return NextResponse.json(question);
}

export async function DELETE(request: NextRequest) {
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
}
