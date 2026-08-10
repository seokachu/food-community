import "server-only";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "./database.types";

/**
 * 만료된 Auth 토큰을 갱신하고 요청/응답 쿠키에 반영한다. src/proxy.ts에서 호출.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // createServerClient와 getClaims() 사이에 다른 코드를 넣지 말 것.
  // getClaims()를 제거하면 유저가 무작위로 로그아웃될 수 있다.
  await supabase.auth.getClaims();

  // supabaseResponse를 그대로 반환해야 한다. 새 응답을 만들 경우
  // request를 넘기고 쿠키를 복사하지 않으면 세션이 조기 종료된다.
  return supabaseResponse;
}
