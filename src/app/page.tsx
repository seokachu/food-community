import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/foundation/Icon";
import {
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { TextField } from "@/components/ui/TextField";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { FEATURED_PLACE_ID, getPlace, RECENT_PLACE_IDS } from "@/lib/places";

import { SubscriptionPromo } from "./SubscriptionPromo";

export const metadata = {
  title: "숨은맛집 · 홈",
  description: "구로에서 차로 한 시간, 직접 다녀온 동네 맛집 이야기.",
};

export default function HomePage() {
  const featured = getPlace(FEATURED_PLACE_ID)!;
  const recent = RECENT_PLACE_IDS.map((id) => getPlace(id)!);

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="숨은맛집"
          trailing={<IconButton icon="more-horizontal" label="더보기" />}
        />
      }
    >
      <Container className="flex flex-col gap-6 py-5 md:gap-10 md:py-10">
        {/* 주말 인사 + 검색. 데스크톱에서는 두 단으로 나눠 히어로가 지나치게 길어지지 않게 한다. */}
        {/* 넓어지면 2:1 로 나눠 검색 필드가 히어로 옆에 붙는다. 고정 폭 대신 비율로 잡는다. */}
        <section className="flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-label-lg text-text-brand">이번 주말엔,</p>
            <h2 className="text-display-md lg:text-display-lg text-text-default">
              차로 슬쩍 떠나는
              <br />
              진짜 동네 맛집
            </h2>
          </div>
          <TextField
            leftIcon="search"
            placeholder="맛집을 검색해보세요"
            aria-label="맛집 검색"
          />
        </section>

        {/* 구독(v1.1) 진입점. 배너를 누르면 구독 안내 시트가 뜬다. */}
        <SubscriptionPromo />

        {/* 이번 주의 숨은 한끼 */}
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md text-text-default">
              이번 주의 숨은 한끼
            </h2>
            <p className="text-label-lg text-text-brand shrink-0">
              구로에서 38분
            </p>
          </header>

          {/* 대표 카드는 데스크톱에서 가로형으로 눕는다. 이미지가 세로로 과하게 커지는 걸 막는다. */}
          <Card
            as={Link}
            href={`/places/${featured.id}`}
            className="lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
          >
            <CardMedia
              src={featured.thumbnail}
              alt={featured.name}
              className="h-44 sm:aspect-[21/9] sm:h-auto lg:aspect-auto lg:h-full lg:min-h-[280px]"
            />
            <CardBody className="p-4 lg:justify-center lg:gap-3 lg:p-8">
              <CardTitle className="lg:text-heading-lg">
                {featured.name}
              </CardTitle>
              <CardDescription className="lg:text-body-lg">
                {featured.summary}
              </CardDescription>
            </CardBody>
          </Card>
        </section>

        {/* 방금 발견했어요 — 1 → 2 → 3열 카드 그리드 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-heading-md text-text-default">방금 발견했어요</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {recent.map((place) => (
              <li key={place.id} className="flex">
                <Card as={Link} href={`/places/${place.id}`} className="w-full">
                  <CardMedia
                    src={place.thumbnail}
                    alt={place.name}
                    className="h-26 sm:aspect-[16/9] sm:h-auto"
                  />
                  <CardBody className="p-3 sm:p-4">
                    <CardTitle>{place.name}</CardTitle>
                    <CardDescription>{place.summary}</CardDescription>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/*
          맛집 등록 유도. 시안은 배너 안에 원형 아이콘 버튼이 들어있지만,
          웹에서는 배너 전체가 등록 화면으로 가는 링크라 원은 장식으로만 둔다.
          a 안에 button 을 넣으면 마크업이 깨진다.
        */}
        <Link
          href="/register"
          className="bg-background-inverse focus-visible:outline-border-brand flex items-center justify-between gap-4 rounded-2xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 md:px-8 md:py-6"
        >
          <span className="flex flex-col gap-2">
            <span className="text-heading-sm text-text-on-inverse">
              나만 알던 집이 있나요?
            </span>
            <span className="text-label-md text-text-on-inverse-secondary">
              사진 한 장이면 충분해요
            </span>
          </span>
          <span
            aria-hidden
            className="bg-background-brand flex size-12 shrink-0 items-center justify-center rounded-full"
          >
            <Icon name="plus" size={24} className="text-icon-on-brand" />
          </span>
        </Link>
      </Container>
    </AppShell>
  );
}
