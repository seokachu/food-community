import { NextResponse } from "next/server";

import { safeNextPath } from "@/lib/auth/next-path";
import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

/** Google → Supabase → 이 라우트로 돌아온 인증 코드를 세션 쿠키로 교환한다. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  // Google 쪽에서 사용자가 취소했거나 설정이 잘못된 경우 code 없이 error 로 돌아온다.
  const providerError = searchParams.get("error");
  if (providerError) {
    console.error("[auth] OAuth 제공자 오류", {
      error: providerError,
      description: searchParams.get("error_description"),
    });
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 첫 로그인이면 앱 프로필을 만든다. 실패해도 로그인은 그대로 진행한다.
      if (data.user) {
        await ensureProfile(supabase, data.user);
      }

      // 로드밸런서 뒤에서는 원래 호스트가 x-forwarded-host로 온다.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth] 코드 교환 실패", { message: error.message });
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code`);
}
