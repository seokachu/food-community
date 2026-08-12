import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "@/components/ui/Avatar";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { BrandMark } from "@/components/ui/BrandMark";
import {
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { MapPreview } from "@/components/ui/MapPreview";
import { NaverMap } from "@/components/ui/NaverMap";

const meta = {
  title: "UI/Display",
  component: Card,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

const TONES: BadgeTone[] = [
  "neutral",
  "success",
  "error",
  "info",
  "warning",
  "brand",
];
const TONE_LABEL: Record<BadgeTone, string> = {
  neutral: "중립",
  success: "완료",
  error: "오류",
  info: "안내",
  warning: "주의",
  brand: "Google 계정 연결됨",
};

/**
 * 이미지 영역 + 콘텐츠 영역. 이미지 높이는 카드가 정하지 않고 호출측이 정한다.
 * 카드 폭이 브레이크포인트마다 달라지는 유동 그리드라 종횡비로 넘긴다.
 */
export const Cards: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardMedia
          src="/images/oryu-charcoal.jpg"
          alt="오류동 골목 숯불구이"
          className="aspect-[16/9]"
        />
        <CardBody className="p-3">
          <CardTitle>오류동 골목 숯불구이</CardTitle>
          <CardDescription>
            참숯 향 좋은 돼지갈비 · 서울 구로구 오류로
          </CardDescription>
        </CardBody>
      </Card>

      <Card>
        <CardMedia className="aspect-[16/9]" />
        <CardBody className="p-3">
          <CardTitle>이미지 없는 플레이스홀더</CardTitle>
          <CardDescription>
            src 를 넘기지 않으면 회색 배경 + 이미지 아이콘이 들어간다.
          </CardDescription>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <CardTitle>작성자의 한 줄 팁</CardTitle>
          <CardDescription>들깨칼국수엔 바삭한 감자전 필수!</CardDescription>
        </CardBody>
      </Card>
    </div>
  ),
};

/** neutral 만 채움이고 나머지 네 톤은 테두리와 글자색으로만 구분한다. */
export const Badges: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map((tone) => (
          <Badge key={tone} tone={tone}>
            {TONE_LABEL[tone]}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map((tone) => (
          <Badge key={tone} tone={tone} size="lg">
            {TONE_LABEL[tone]}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

/** 상세 화면 작성자(28 · 뉴트럴)와 마이페이지 프로필(88 · 브랜드 소프트). */
export const Avatars: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default flex items-center gap-6 p-6">
      <Avatar size={28} />
      <Avatar size={88} tone="brand" />
      <Avatar size={88} src="/images/sanmaru-interior.jpg" alt="프로필 사진" />
    </div>
  ),
};

/** 로그인 화면의 브랜드 마크. 헤더에서 쓰려고 작은 사이즈를 추가했다. */
export const BrandMarks: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default flex items-center gap-6 p-6">
      <BrandMark size={32} />
      <BrandMark size={40} />
      <BrandMark size={64} />
    </div>
  ),
};

/**
 * 지도 SDK 가 붙기 전까지 쓰는 자리표시자.
 * 실제 캡처(image) · 도형 폴백(located) · 등록 비활성(empty) 세 가지다.
 */
export const Maps: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2">
      <MapPreview
        variant="image"
        src="/images/naver-map-gwangmyeong-gahak.png"
        alt="산마루 들깨칼국수 위치 지도"
        className="h-[190px] rounded-2xl"
      />
      <MapPreview caption="광명동 · 가학산 입구" />
      <MapPreview variant="empty" />
    </div>
  ),
};

/**
 * 실제 네이버 지도(장소 선택 화면). 핀은 중심에 고정되고 지도를 움직여 맞춘다.
 * 스토리북엔 서버 환경변수가 없어 기본으로 키 미설정 폴백이 보인다.
 * 실지도를 확인하려면 STORYBOOK_NAVER_MAP_CLIENT_ID 를 넣고 다시 시작한다.
 * 오른쪽은 키가 없을 때의 폴백 상태를 일부러 보여주는 예시다.
 */
export const NaverMaps: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2">
      <NaverMap
        clientId={process.env.STORYBOOK_NAVER_MAP_CLIENT_ID ?? ""}
        className="h-[320px] rounded-2xl"
      />
      <NaverMap clientId="" className="h-[320px] rounded-2xl" />
    </div>
  ),
};

/**
 * 저장된 장소를 보여주는 조회용 지도. 중심 핀 대신 좌표에 고정된 마커를 쓴다.
 * 왼쪽은 상세 위치 블록(조작 가능), 오른쪽은 등록 폼 미리보기(조작 불가) 용례다.
 */
export const NaverMapMarkers: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2">
      <NaverMap
        clientId={process.env.STORYBOOK_NAVER_MAP_CLIENT_ID ?? ""}
        center={{ lat: 37.5666103, lng: 126.9783882 }}
        marker={{ lat: 37.5666103, lng: 126.9783882 }}
        centerPin={false}
        zoom={16}
        className="h-[190px] rounded-2xl"
      />
      <NaverMap
        clientId={process.env.STORYBOOK_NAVER_MAP_CLIENT_ID ?? ""}
        center={{ lat: 37.5666103, lng: 126.9783882 }}
        marker={{ lat: 37.5666103, lng: 126.9783882 }}
        centerPin={false}
        interactive={false}
        zoom={16}
        className="h-[146px] rounded-2xl"
      />
    </div>
  ),
};
