// lib/auth/signInWithGoogle.ts
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/callback`,
    },
  });

  if (error) throw error;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "USER",
        full_name: name,
      },
    },
  });

  console.log("Datao f sesinon:", data);
  await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: data?.user?.id,
      email,
      role: "USER",
      name,
    }),
  });
  if (error) throw error;
  return data;
};
