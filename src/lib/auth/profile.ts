import "server-only";

import type { SupabaseServerClient, User } from "@/lib/supabase/server";
import { PROFILE_IMAGE_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";

export interface AppProfile {
  nickname: string;
  imagePath: string | null;
}

/** BFF 응답과 서버 컴포넌트가 함께 쓰는 화면용 프로필. */
export interface ProfileView {
  nickname: string;
  imageUrl: string | null;
}

/**
 * Google 이 넘겨준 값에서 표시용 닉네임을 만든다.
 * user_metadata 는 사용자가 바꿀 수 있으므로 표시 외의 판단에는 쓰지 않는다.
 */
export function displayNameOf(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}) {
  const metadata = user.user_metadata ?? {};
  const pick = (key: string) => {
    const value = metadata[key];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  };

  return (
    pick("full_name") ??
    pick("name") ??
    user.email?.split("@")[0] ??
    "회원"
  );
}

/** getClaims() 가 돌려주는 JWT 클레임에서 표시용 닉네임을 만든다. */
export function displayNameOfClaims(claims: {
  email?: unknown;
  user_metadata?: unknown;
}) {
  return displayNameOf({
    email: typeof claims.email === "string" ? claims.email : undefined,
    user_metadata:
      (claims.user_metadata as Record<string, unknown> | null) ?? null,
  });
}

/**
 * profile 행을 화면·API 응답용으로 바꾼다. 행이 아직 없으면(첫 로그인 직후 등)
 * JWT 클레임의 Google 이름으로 대체한다. image_path 는 여기서만 전체 URL 이 된다.
 */
export function toProfileView(
  profile: AppProfile | null,
  claims: { email?: unknown; user_metadata?: unknown },
): ProfileView {
  return {
    nickname: profile?.nickname ?? displayNameOfClaims(claims),
    imageUrl: profile?.imagePath
      ? publicStorageUrl(PROFILE_IMAGE_BUCKET, profile.imagePath)
      : null,
  };
}

export function avatarUrlOf(user: { user_metadata?: Record<string, unknown> | null }) {
  const metadata = user.user_metadata ?? {};
  const pick = (key: string) => {
    const value = metadata[key];
    return typeof value === "string" && value ? value : undefined;
  };

  return pick("avatar_url") ?? pick("picture");
}

/**
 * 첫 로그인 시 profile 행을 만든다. 이미 있으면 건드리지 않는다 —
 * 사용자가 바꾼 닉네임을 다음 로그인 때 Google 값으로 되돌리면 안 되기 때문이다.
 *
 * 프로필 생성이 실패해도 로그인 자체는 성립시킨다(세션은 이미 발급됐다).
 */
export async function ensureProfile(
  supabase: SupabaseServerClient,
  user: User,
) {
  const { error } = await supabase.from("profile").upsert(
    { user_id: user.id, nickname: displayNameOf(user) },
    { onConflict: "user_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("[auth] profile 생성 실패", { userId: user.id, error });
  }
}

/** 마이페이지 등에서 쓰는 앱 프로필. 아직 행이 없으면 null. */
export async function getProfile(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<AppProfile | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("nickname, image_path")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[auth] profile 조회 실패", { userId, error });
    return null;
  }
  if (!data) return null;

  return { nickname: data.nickname, imagePath: data.image_path };
}
