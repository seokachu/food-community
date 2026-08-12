/**
 * 맛집 글 입력 규칙. BFF 라우트와 클라이언트 폼이 같은 기준을 쓰도록
 * server-only 가 아닌 모듈에 둔다. Supabase 접근이 없는 순수 상수·함수만 둔다.
 */
export const PLACE_CONTENT_MIN_LENGTH = 10;

export const PLACE_NAME_MAX_LENGTH = 80;
export const PLACE_ADDRESS_MAX_LENGTH = 120;

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

/**
 * URL 파라미터의 place.id(bigint) 파싱. 숫자 문자열만 유효한 id 로 보므로
 * 목데이터의 문자열 id 와도 자연스럽게 구분된다.
 */
export function parsePlaceId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

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

/** 지도 정보 묶음. 장소명·지번주소·좌표가 모두 있어야 등록·수정할 수 있다. */
export interface PlaceLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

/** FormData 값(문자열)과 폼 상태(숫자)를 모두 받아 유효 범위의 좌표로만 통과시킨다. */
function parseLocationCoord(raw: unknown, max: number): number | null {
  const value =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw.trim()
        ? Number(raw)
        : NaN;
  return Number.isFinite(value) && Math.abs(value) <= max ? value : null;
}

/**
 * 지도 정보(장소명·지번주소·좌표) 검사. 하나라도 비면 통과시키지 않는다.
 * BFF 라우트(FormData)와 등록 폼(상태 값)이 같은 기준을 쓴다.
 */
export function validatePlaceLocation(raw: {
  name: unknown;
  address: unknown;
  lat: unknown;
  lng: unknown;
}): Validation<PlaceLocation> {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const address = typeof raw.address === "string" ? raw.address.trim() : "";
  const lat = parseLocationCoord(raw.lat, 90);
  const lng = parseLocationCoord(raw.lng, 180);

  if (!name || !address || lat === null || lng === null) {
    return { ok: false, message: "지도에서 장소를 선택해주세요" };
  }
  if (name.length > PLACE_NAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `장소명은 ${PLACE_NAME_MAX_LENGTH}자 이내로 입력해주세요`,
    };
  }
  if (address.length > PLACE_ADDRESS_MAX_LENGTH) {
    return {
      ok: false,
      message: `주소는 ${PLACE_ADDRESS_MAX_LENGTH}자 이내로 입력해주세요`,
    };
  }
  return { ok: true, value: { name, address, lat, lng } };
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
