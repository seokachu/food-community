import { NextResponse } from "next/server";

/** 네이버 지도(NCP Maps) 리버스 지오코딩 엔드포인트. Dynamic Map 과 같은 Application 키를 쓴다. */
const REVERSE_GEOCODE_URL = "https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc";

/** 응답 status.code — 0 은 성공, 3 은 결과 없음(바다·국외 등 주소가 없는 좌표). */
const STATUS_OK = 0;
const STATUS_NO_RESULT = 3;

interface ReverseGeocodeResult {
  /** 요청한 orders 값. 지번주소는 "addr" 로 온다. */
  name: string;
  region?: Partial<
    Record<"area1" | "area2" | "area3" | "area4", { name?: string }>
  >;
  land?: {
    /** "1" 일반 지번, "2" 산 지번. */
    type?: string;
    number1?: string;
    number2?: string;
  };
}

/**
 * 분해되어 오는 지번주소를 한 줄로 합친다.
 * 시도(area1)~리(area4) 뒤에 번지를 붙이고, 산 지번은 `산 118-1` 처럼 앞에 `산`을 단다.
 */
function formatJibunAddress(result: ReverseGeocodeResult): string | null {
  const region = ["area1", "area2", "area3", "area4"].map(
    (area) => result.region?.[area as "area1"]?.name?.trim() ?? "",
  );
  const { type, number1, number2 } = result.land ?? {};
  const lot = number1
    ? `${type === "2" ? "산 " : ""}${number1}${number2 ? `-${number2}` : ""}`
    : "";
  const parts = [...region, lot].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

/** lat·lng 쿼리 파라미터를 유효 범위의 숫자로만 받는다. */
function parseCoord(raw: string | null, max: number): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && Math.abs(value) <= max ? value : null;
}

/**
 * GET /api/reverse-geocode?lat=…&lng=… — 네이버 리버스 지오코딩 프록시.
 * 키를 서버에만 두기 위한 BFF 로, 지번주소(orders=addr)를 한 줄로 합쳐
 * `{ ok: true, address: string | null }` 로 돌려준다. 주소가 없는 좌표면 null.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseCoord(searchParams.get("lat"), 90);
    const lng = parseCoord(searchParams.get("lng"), 180);
    if (lat === null || lng === null) {
      return NextResponse.json(
        { ok: false, error: "좌표(lat, lng)가 올바르지 않습니다" },
        { status: 400 },
      );
    }

    const clientId = process.env.NAVER_MAP_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error(
        "[reverse-geocode] NAVER_MAP_CLIENT_ID / NAVER_MAP_CLIENT_SECRET 이 설정되지 않았습니다",
      );
      return NextResponse.json(
        { ok: false, error: "주소 조회 설정이 완료되지 않았습니다" },
        { status: 500 },
      );
    }

    const url = new URL(REVERSE_GEOCODE_URL);
    // coords 는 경도,위도 순서다. lat,lng 로 보내면 엉뚱한 곳이 조회된다.
    url.searchParams.set("coords", `${lng},${lat}`);
    url.searchParams.set("orders", "addr");
    url.searchParams.set("output", "json");

    const response = await fetch(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[reverse-geocode] 네이버 리버스 지오코딩 호출 실패", {
        status: response.status,
        body: await response.text().catch(() => ""),
      });
      return NextResponse.json(
        { ok: false, error: "주소 조회에 실패했습니다. 잠시 후 다시 시도해주세요" },
        { status: 502 },
      );
    }

    const body = (await response.json()) as {
      status?: { code?: number; message?: string };
      results?: ReverseGeocodeResult[];
    };

    if (body.status?.code === STATUS_NO_RESULT) {
      return NextResponse.json({ ok: true, address: null });
    }
    if (body.status?.code !== STATUS_OK) {
      console.error("[reverse-geocode] 네이버 리버스 지오코딩 응답 오류", body.status);
      return NextResponse.json(
        { ok: false, error: "주소 조회에 실패했습니다. 잠시 후 다시 시도해주세요" },
        { status: 502 },
      );
    }

    const addr = body.results?.find((result) => result.name === "addr");
    return NextResponse.json({
      ok: true,
      address: addr ? formatJibunAddress(addr) : null,
    });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
