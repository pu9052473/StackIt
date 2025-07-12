import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { supabase } = createClient(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { user: null, message: "Unauthorized" },
      { status: 401 }
    );

  // Ensure user exists in your DB
  let userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userData) {
    userData = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || "User",
        role: user.user_metadata?.role || "USER",
      },
    });
  }

  return NextResponse.json(
    { user: userData, message: "Session fetched" },
    { status: 200 }
  );
}
