import { NextResponse } from "next/server";

import { getProfile, toProfileView } from "@/lib/auth/profile";
import { validateNickname } from "@/lib/profile-rules";
import { createClient } from "@/lib/supabase/server";

/** GET /api/profile — 로그인한 유저의 프로필(닉네임 + 이미지 URL). */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (!claims) {
      return NextResponse.json(
        { ok: false, error: "로그인이 필요합니다" },
        { status: 401 },
      );
    }

    const profile = await getProfile(supabase, claims.sub as string);
    return NextResponse.json({ ok: true, profile: toProfileView(profile, claims) });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/** PATCH /api/profile — 닉네임 변경. body: { nickname: string } */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (!claims) {
      return NextResponse.json(
        { ok: false, error: "로그인이 필요합니다" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const nickname = validateNickname(
      (body as { nickname?: unknown } | null)?.nickname,
    );
    if (!nickname.ok) {
      return NextResponse.json(
        { ok: false, error: nickname.message },
        { status: 400 },
      );
    }

    // 첫 로그인 때 행 생성이 실패했을 수 있으므로 upsert 로 그 경우까지 흡수한다.
    // image_path 는 넘기지 않으므로 기존 값이 유지된다.
    const { data: row, error } = await supabase
      .from("profile")
      .upsert(
        { user_id: claims.sub as string, nickname: nickname.value },
        { onConflict: "user_id" },
      )
      .select("nickname, image_path")
      .single();

    if (error) {
      console.error("[profile] 닉네임 변경 실패", { userId: claims.sub, error });
      return NextResponse.json(
        { ok: false, error: "닉네임 변경에 실패했습니다" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      profile: toProfileView(
        { nickname: row.nickname, imagePath: row.image_path },
        claims,
      ),
    });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
