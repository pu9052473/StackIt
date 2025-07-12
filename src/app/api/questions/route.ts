import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId");
  const data = await request.json();
  if (!data.tags || data.tags.length === 0) {
    return NextResponse.json(
      { message: "atleast One Tag is Required" },
      { status: 400 }
    );
  }
  if (!data.description) {
    return NextResponse.json(
      { message: "Question Description is Required" },
      { status: 400 }
    );
  }
  if (!data.title) {
    return NextResponse.json(
      { message: "Question Title is Required" },
      { status: 400 }
    );
  }
  if (questionId) {
    const updatedQuestion = await prisma.question.update({
      where: { id: Number(questionId) },
      data,
    });
    return NextResponse.json(
      {
        message: `${questionId ? "Question updated" : "Question created"}`,
        updatedQuestion,
      },
      { status: 200 }
    );
  } else {
    const createdQuestion = await prisma.question.create({ data: { ...data } });
    return NextResponse.json(createdQuestion, { status: 201 });
  }
}

import { Prisma } from "@prisma/client"; // ✅ import Prisma for enums

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const filter = searchParams.get("filter") || "newest";

    const where: Prisma.QuestionWhereInput = {
      OR: [
        {
          title: {
            contains: query,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
      ...(filter === "answered" && { isAnswered: true }),
      ...(filter === "unanswered" && { isAnswered: false }),
    };

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { userName: true } },
        answer: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.question.count({ where });

    return NextResponse.json({ questions, total });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
