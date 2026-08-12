import type { MapCoord } from "@/components/ui/NaverMap";

/**
 * 좌표 → 지번주소. 키가 서버에만 있어 BFF(GET /api/reverse-geocode)를 거친다.
 * 주소가 없는 좌표(바다 등)면 null, 실패하면 사용자에게 그대로 보여줄 메시지를 담아 던진다.
 */
export async function reverseGeocode({ lat, lng }: MapCoord): Promise<string | null> {
  const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
  const body = (await response.json().catch(() => null)) as {
    ok: boolean;
    address?: string | null;
    error?: string;
  } | null;

  if (!response.ok || !body?.ok) {
    throw new Error(body?.error ?? "주소 조회에 실패했습니다. 잠시 후 다시 시도해주세요");
  }
  return body.address ?? null;
}
