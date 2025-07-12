import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const cookie = cookies();
  const userC = cookie.get("stackit_user_data");
  const user = userC ? JSON.parse(userC.value) : null;
  console.log("user", user);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { voteType } = await req.json();
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get("answerId");

  if (!answerId || !["up", "down"].includes(voteType)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const answer = await prisma.answer.findUnique({
      where: { id: Number(answerId) },
      include: { votes: true },
    });

    if (!answer) {
      return NextResponse.json(
        { message: "Answer not found" },
        { status: 404 }
      );
    }

    if (answer.userId === user.id) {
      return NextResponse.json(
        { message: "You can't vote on your own answer" },
        { status: 403 }
      );
    }
    console.log(answer);
    const existingVote = answer.votes.find((v) => v.userId === user.id);
    if (existingVote) {
      return NextResponse.json({ message: "Already voted" }, { status: 403 });
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id: Number(answerId) },
      data: {
        upVote: voteType === "up" ? answer.upVote + 1 : answer.upVote,
        downVote: voteType === "down" ? answer.downVote + 1 : answer.downVote,
        votes: {
          create: {
            userId: user.id,
            type: voteType,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Vote recorded",
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
