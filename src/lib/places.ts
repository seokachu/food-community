import type { BadgeTone } from "@/components/ui/Badge";

/**
 * 화면에 들어가는 문구·이미지는 전부 design.pen 시안의 값이다.
 * 실제 API 가 붙기 전까지 쓰는 고정 데이터라 시안 밖의 내용을 지어내지 않는다.
 */
export interface PlaceTag {
  label: string;
  tone: BadgeTone;
}

export interface Place {
  id: string;
  name: string;
  /** 카드에 쓰는 한 줄 요약. */
  summary: string;
  /** 카드 썸네일. */
  thumbnail: string;
  /** 상세 화면 대표 사진. 없으면 thumbnail 을 쓴다. */
  hero?: string;
  photoCount: number;
  tags: PlaceTag[];
  author: string;
  postedAt: string;
  /** 상세 본문. 문단 단위로 나눠 둔다. */
  story: string[];
  tip: string;
  address: string;
  /** 상세 위치 블록의 지도 캡처. 없으면 도형 자리표시자(MapPreview located)를 쓴다. */
  mapImage?: string;
  mapCaption: string;
  /** 마이페이지 `내가 쓴 글` 카드에 쓰는 작성일. */
  writtenOn: string;
}

export const PLACES: Place[] = [
  {
    id: "sanmaru",
    name: "산마루 들깨칼국수",
    summary:
      "직접 빻은 들깨 향이 진하고, 창밖 산자락까지 한 그릇에 담긴 집이에요.",
    thumbnail: "/images/sanmaru-storefront.jpg",
    hero: "/images/sanmaru-interior.jpg",
    photoCount: 3,
    tags: [
      { label: "주차 가능", tone: "success" },
      { label: "아이와 함께", tone: "info" },
    ],
    author: "주말드라이버",
    postedAt: "3일 전",
    story: [
      "광명 외곽길을 따라가다 만나는 조용한 칼국수집이에요. 직접 빻은 들깨라 국물이 고소하고, 김치도 매일 담근대요.",
      "가게 앞 주차 공간이 넉넉해서 부모님과 함께 오기 좋았습니다. 점심 12시 전엔 기다림도 거의 없었어요.",
    ],
    tip: "들깨칼국수엔 바삭한 감자전 필수!",
    address: "경기 광명시 가학로 88 산마루 1층",
    mapImage: "/images/naver-map-gwangmyeong-gahak.png",
    mapCaption: "광명동 · 가학산 입구",
    writtenOn: "2026.08.01",
  },
  {
    id: "oryu",
    name: "오류동 골목 숯불구이",
    summary: "참숯 향 좋은 돼지갈비 · 서울 구로구 오류로",
    thumbnail: "/images/oryu-charcoal.jpg",
    photoCount: 1,
    tags: [{ label: "주차 가능", tone: "success" }],
    author: "드라이브러버",
    postedAt: "6일 전",
    story: [
      "골목 안쪽이라 처음엔 지나칠 뻔했어요. 참숯에 구워 나오는 돼지갈비 향이 문 앞까지 퍼집니다.",
    ],
    tip: "된장찌개까지 시켜야 완성이에요.",
    address: "서울 구로구 오류로 12",
    mapCaption: "오류동 · 골목 안쪽",
    writtenOn: "2026.07.28",
  },
  {
    id: "bambi",
    name: "밤비 호수 베이커리",
    summary: "호수 산책 뒤 들르기 좋은 작은 빵집 · 경기 부천시 호수로",
    thumbnail: "/images/bambi-bakery.jpg",
    photoCount: 1,
    tags: [{ label: "아이와 함께", tone: "info" }],
    author: "드라이브러버",
    postedAt: "2주 전",
    story: [
      "호수 한 바퀴 돌고 들르기 딱 좋은 자리에 있어요. 창가 자리에서 갓 구운 빵 냄새를 맡으며 쉬어가기 좋습니다.",
    ],
    tip: "오후 3시쯤 갓 나온 빵이 가장 많아요.",
    address: "경기 부천시 호수로 45",
    mapCaption: "상동 · 호수공원 앞",
    writtenOn: "2026.07.20",
  },
];

export function getPlace(id: string) {
  return PLACES.find((place) => place.id === id);
}

/** 메인 `이번 주의 숨은 한끼` 에 올라가는 대표 맛집. */
export const FEATURED_PLACE_ID = "sanmaru";

/** 메인 `방금 발견했어요` 목록. */
export const RECENT_PLACE_IDS = ["oryu", "bambi"];

/** 마이페이지 `내가 쓴 글` 목록. */
export const MY_POST_IDS = ["oryu", "bambi"];
