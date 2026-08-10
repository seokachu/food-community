import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/** 맛집 등록은 로그인한 회원만 가능하다(PRD 흐름 B). */
export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    // 로그인 후 등록 화면으로 되돌아온다(PRD 흐름 B).
    redirect("/login?next=/register");
  }

  return children;
}
