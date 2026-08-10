/**
 * 프로필 입력 규칙. BFF 라우트와 클라이언트 폼이 같은 기준을 쓰도록
 * server-only 가 아닌 모듈에 둔다. Supabase 접근이 없는 순수 상수·함수만 둔다.
 */
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 20;

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** 허용 MIME → 저장 확장자. 파일명 확장자는 조작 가능하므로 MIME 을 기준으로 쓴다. */
export const PROFILE_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const PROFILE_IMAGE_ACCEPT = Object.keys(PROFILE_IMAGE_TYPES).join(",");

export function validateNickname(
  raw: unknown,
): { ok: true; value: string } | { ok: false; message: string } {
  if (typeof raw !== "string") {
    return { ok: false, message: "닉네임을 입력해주세요" };
  }
  const value = raw.trim();
  if (
    value.length < NICKNAME_MIN_LENGTH ||
    value.length > NICKNAME_MAX_LENGTH
  ) {
    return {
      ok: false,
      message: `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해주세요`,
    };
  }
  return { ok: true, value };
}
