import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const access_token = requestUrl.searchParams.get("access_token");
  const refresh_token = requestUrl.searchParams.get("refresh_token");

  const supabase = await createClient();

  const payLoad = {
    access_token: access_token ?? "",
    refresh_token: refresh_token ?? "",
  };
  if (access_token) {
    await supabase.auth.setSession(payLoad);
  }

  const { data } = await supabase.auth.getUser();
  let userData = await prisma.user.findUnique({
    where: { id: data?.user?.id },
  });
  if (!userData) {
    userData = await prisma.user.create({
      data: {
        id: data?.user?.id,
        email: data?.user?.email!,
        userName: data?.user?.email?.split('@')[0] || "User",
        role: data?.user?.user_metadata?.role || "USER",
      },
    });
  }

  // URL to redirect to after sign in process completes
  return NextResponse.json(
    { message: "AuthSession created", user: userData },
    { status: 200 }
  );
}
