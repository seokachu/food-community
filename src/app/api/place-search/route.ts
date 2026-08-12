import { NextResponse } from "next/server";

/** 네이버 지역검색(NCP API Hub · Search > Local) 엔드포인트. */
const SEARCH_URL = "https://naverapihub.apigw.ntruss.com/search/v1/local";
/** 문서상 display 는 1~5. 최대로 받아 보여준다. */
const MAX_RESULTS = 5;

interface LocalSearchItem {
  title: string;
  category: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

/** 검색어 강조용 `<b>` 태그와 HTML 엔티티를 걷어낸 순수 텍스트. */
function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

/** mapx/mapy 는 WGS84 좌표를 10⁷배 한 정수 문자열(예: "1270425678")로 온다. */
function toDegrees(raw: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value === 0) return null;
  return Math.abs(value) > 1000 ? value / 1e7 : value;
}

/**
 * GET /api/place-search?query=… — 네이버 지역검색 프록시.
 * 키를 서버에만 두기 위한 BFF 로, 결과는 화면이 쓰는 모양
 * `{ name, address, position?: { lat, lng } }` 로 줄여서 돌려준다.
 */
export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("query")?.trim();
    if (!query) {
      return NextResponse.json(
        { ok: false, error: "검색어를 입력해주세요" },
        { status: 400 },
      );
    }

    const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
    const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error(
        "[place-search] NAVER_SEARCH_CLIENT_ID / NAVER_SEARCH_CLIENT_SECRET 이 설정되지 않았습니다",
      );
      return NextResponse.json(
        { ok: false, error: "장소 검색 설정이 완료되지 않았습니다" },
        { status: 500 },
      );
    }

    const url = new URL(SEARCH_URL);
    url.searchParams.set("query", query);
    url.searchParams.set("display", String(MAX_RESULTS));

    const response = await fetch(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[place-search] 네이버 지역검색 호출 실패", {
        status: response.status,
        body: await response.text().catch(() => ""),
      });
      return NextResponse.json(
        { ok: false, error: "장소 검색에 실패했습니다. 잠시 후 다시 시도해주세요" },
        { status: 502 },
      );
    }

    const body = (await response.json()) as { items?: LocalSearchItem[] };
    const places = (body.items ?? []).map((item) => {
      const lat = toDegrees(item.mapy);
      const lng = toDegrees(item.mapx);
      return {
        name: stripHtml(item.title),
        // 지번주소가 기본. 비어 있으면 도로명주소로라도 채운다.
        address: item.address || item.roadAddress || null,
        position: lat !== null && lng !== null ? { lat, lng } : undefined,
      };
    });

    return NextResponse.json({ ok: true, places });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
