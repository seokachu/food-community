import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

/**
 * Supabase 타입은 이 모듈에서만 다시 내보낸다.
 * 바깥에서 `@supabase/*` 를 직접 import 하는 것은 ESLint 로 막혀 있다.
 */
export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
export type { User } from "@supabase/supabase-js";

function requireEnv(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 없습니다. .env.local을 확인하세요.`);
  }
  return value;
}

/**
 * Route Handler · Server Action · 서버 컴포넌트에서 사용하는 Supabase 클라이언트.
 * 쿠키 세션 기반으로 요청한 유저 권한(RLS)으로 동작한다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없다. 세션 갱신은 proxy가 담당하므로 무시.
          }
        },
      },
    },
  );
}
