/**
 * 맛집 글 입력 규칙. BFF 라우트와 클라이언트 폼이 같은 기준을 쓰도록
 * server-only 가 아닌 모듈에 둔다. Supabase 접근이 없는 순수 상수·함수만 둔다.
 */
export const PLACE_CONTENT_MIN_LENGTH = 10;

/** 주소 입력은 다음 단계에서 붙인다. 그전까지 등록되는 글에 자동 저장되는 값. */
export const PLACE_ADDRESS_PENDING = "등록 대기중";

export const PLACE_IMAGE_MIN_COUNT = 1;
export const PLACE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** 허용 MIME → 저장 확장자. 파일명 확장자는 조작 가능하므로 MIME 을 기준으로 쓴다. */
export const PLACE_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const PLACE_IMAGE_ACCEPT = Object.keys(PLACE_IMAGE_TYPES).join(",");

type Validation<T> = { ok: true; value: T } | { ok: false; message: string };

export function validatePlaceTitle(raw: unknown): Validation<string> {
  if (typeof raw !== "string" || !raw.trim()) {
    return { ok: false, message: "제목을 입력해주세요" };
  }
  return { ok: true, value: raw.trim() };
}

export function validatePlaceContent(raw: unknown): Validation<string> {
  if (typeof raw !== "string" || !raw.trim()) {
    return { ok: false, message: "내용을 입력해주세요" };
  }
  const value = raw.trim();
  if (value.length < PLACE_CONTENT_MIN_LENGTH) {
    return {
      ok: false,
      message: `내용은 ${PLACE_CONTENT_MIN_LENGTH}글자 이상 입력해주세요`,
    };
  }
  return { ok: true, value };
}

/**
 * 첨부 이미지 검사. File 을 직접 받지 않고 type·size 만 보므로
 * 서버(FormData)와 브라우저 폼 어느 쪽에서도 쓸 수 있다.
 * `minCount` 는 등록이면 1, 수정처럼 추가분만 검사할 때는 0 을 넘긴다.
 */
export function validatePlaceImages(
  files: { type: string; size: number }[],
  minCount: number = PLACE_IMAGE_MIN_COUNT,
): { ok: true } | { ok: false; message: string } {
  if (files.length < minCount) {
    return { ok: false, message: "이미지를 1장 이상 첨부해주세요" };
  }
  for (const file of files) {
    if (!PLACE_IMAGE_TYPES[file.type]) {
      return { ok: false, message: "JPG, PNG, WebP 이미지만 올릴 수 있어요" };
    }
    if (file.size > PLACE_IMAGE_MAX_BYTES) {
      return { ok: false, message: "이미지는 5MB 이하로 올려주세요" };
    }
  }
  return { ok: true };
}
