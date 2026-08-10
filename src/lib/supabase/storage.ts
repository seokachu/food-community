import "server-only";

/**
 * Storage 공개 객체 주소 조립. DB에는 버킷 안 경로(`<user_id>/<uuid>.<ext>`)만
 * 저장하고, 화면에 내려줄 때만 여기서 전체 URL로 만든다.
 * 주소가 바뀌어도(프로젝트 이전·CDN) DB를 갈아엎지 않기 위해서다.
 */
export const PROFILE_IMAGE_BUCKET = "profile-image";
export const PLACE_IMAGE_BUCKET = "place-image";

function storageBaseUrl() {
  const value = process.env.SUPABASE_STORAGE_URL;
  if (!value) {
    throw new Error(
      "SUPABASE_STORAGE_URL 환경변수가 없습니다. .env.local을 확인하세요.",
    );
  }
  return value.replace(/\/+$/, "");
}

export function publicStorageUrl(bucket: string, path: string) {
  return `${storageBaseUrl()}/${bucket}/${path}`;
}
