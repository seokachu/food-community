import type { MapCoord } from "@/components/ui/NaverMap";

/** BFF(GET /api/place-search)가 돌려주는 네이버 지역검색 결과 한 건. */
export interface PlaceSearchResult {
  name: string;
  /** 지번주소. 없으면 도로명주소, 그것도 없으면 null. */
  address: string | null;
  /** mapx/mapy(WGS84 ×10⁷)를 도 단위 lat/lng 로 바꾼 좌표. 없을 수 있다. */
  position?: MapCoord;
}

/**
 * 네이버 지역검색. 키가 서버에만 있어 BFF 를 거친다.
 * 실패하면 사용자에게 그대로 보여줄 메시지를 담아 던진다.
 */
export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const response = await fetch(
    `/api/place-search?query=${encodeURIComponent(query.trim())}`,
  );
  const body = (await response.json().catch(() => null)) as {
    ok: boolean;
    places?: PlaceSearchResult[];
    error?: string;
  } | null;

  if (!response.ok || !body?.ok || !body.places) {
    throw new Error(body?.error ?? "장소 검색에 실패했습니다. 잠시 후 다시 시도해주세요");
  }
  return body.places;
}
