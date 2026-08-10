"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { safeNextPath } from "@/lib/auth/next-path";
import { createClient } from "@/lib/supabase/server";

async function resolveOrigin() {
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin) return origin;

  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/**
 * Google OAuth 로그인 시작. PKCE 코드 교환은 /api/auth/callback이 담당한다.
 * `nextPath`는 bind로 넘어오는 값이라 클라이언트가 조작할 수 있다 — 반드시 걸러 쓴다.
 */
export async function signInWithGoogle(nextPath?: string) {
  const origin = await resolveOrigin();
  const next = safeNextPath(nextPath);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
