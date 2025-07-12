import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request: NextRequest) {
  try {
    const cookie = cookies();
    const userC = cookie.get("stackit_user_data");
    const user = userC ? JSON.parse(userC.value) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("user: ", user);
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const data = await request.json();
    console.log("PATCH question payload:", {
      title: data.title,
      tags: data.tags,
      description: JSON.stringify(data.description),
    });

    if (!data.title) {
      return NextResponse.json(
        { message: "Question Title is Required" },
        { status: 400 }
      );
    }

    if (!data.description || typeof data.description !== "object") {
      return NextResponse.json(
        { message: "Question Description must be a valid JSON object" },
        { status: 400 }
      );
    }

    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
      return NextResponse.json(
        { message: "At least one tag is required" },
        { status: 400 }
      );
    }
    const parsedDescription =
      typeof data.description === "string"
        ? JSON.parse(data.description)
        : data.description;

    if (questionId) {
      const updatedQuestion = await prisma.question.update({
        where: { id: Number(questionId) },
        data: {
          title: data.title,
          description: parsedDescription,
          tag: data.tags,
        },
      });

      return NextResponse.json(
        { message: "Question updated", updatedQuestion },
        { status: 200 }
      );
    } else {
      const createdQuestion = await prisma.question.create({
        data: {
          title: data.title,
          description: parsedDescription,
          tag: data.tags,
          userId: user.id,
        },
      });

      return NextResponse.json(
        { message: "Question created", question: createdQuestion },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error in PATCH /api/questions:", error);

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
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
