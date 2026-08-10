import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { MapPreview } from "@/components/ui/MapPreview";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { getPlace, PLACES } from "@/lib/places";

/** 목데이터가 세 곳뿐이라 전부 빌드 타임에 미리 만든다. */
export function generateStaticParams() {
  return PLACES.map((place) => ({ id: place.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = getPlace(id);

  return {
    title: place ? `${place.name} · 숨은맛집` : "숨은맛집",
    description: place?.summary,
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = getPlace(id);

  if (!place) notFound();

  const heroSrc = place.hero ?? place.thumbnail;

  /** 위치 블록은 모바일에서는 본문 끝에, 데스크톱에서는 우측 사이드바에 붙는다. */
  const locationBlock = (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-heading-md text-text-default">위치</h2>
        <Button variant="secondary" size="sm" leftIcon="copy">
          주소 복사
        </Button>
      </header>
      <p className="text-body-md text-text-secondary">{place.address}</p>
      <MapPreview caption={place.mapCaption} />
      <Button size="lg" fullWidth leftIcon="arrow-right">
        지도에서 길찾기
      </Button>
    </section>
  );

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="맛집 이야기"
          leading={
            <IconButton as={Link} href="/" icon="arrow-left" label="뒤로가기" />
          }
          trailing={<IconButton icon="more-horizontal" label="더보기" />}
        />
      }
    >
      {/*
        대표 사진. 모바일은 화면 폭을 꽉 채우고(Container 거터를 음수 마진으로 상쇄),
        넓어지면 컨테이너 안으로 들어와 둥글어진다. 폭 규칙은 Container 가 갖는다.
      */}
      <Container className="md:pt-6">
        {/* -mx-4 로 모바일에서만 Container 거터를 상쇄해 화면 끝까지 채운다. */}
        <div
          role="img"
          aria-label={`${place.name} 사진`}
          style={{ backgroundImage: `url(${heroSrc})` }}
          className="bg-background-disabled relative -mx-4 h-[278px] bg-cover bg-center md:mx-0 md:aspect-[21/9] md:h-auto md:rounded-2xl"
        >
          <span className="bg-background-overlay text-label-lg text-text-on-inverse absolute right-4 bottom-4 flex h-7 items-center rounded-full px-3">
            1 / {place.photoCount}
          </span>
        </div>
      </Container>

      <Container className="flex flex-col gap-6 py-6 md:gap-10 md:py-10">
        {/* 데스크톱 전용 뒤로가기. 모바일 TopNavigation 이 감춰진 자리를 대신한다. */}
        <Link
          href="/"
          className="text-label-lg text-text-secondary hover:text-text-default hidden w-fit items-center gap-1 md:inline-flex"
        >
          ← 목록으로
        </Link>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag) => (
                  <Badge key={tag.label} tone={tag.tone}>
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <h1 className="text-display-sm lg:text-display-md text-text-default">
                {place.name}
              </h1>
              <div className="flex items-center gap-2">
                <Avatar size={28} />
                <p className="text-label-md text-text-secondary">
                  {place.author} · {place.postedAt}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-heading-md text-text-default">
                여기, 이런 곳이에요
              </h2>
              {place.story.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-body-md lg:text-body-lg text-text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <Card>
              {/* 시안의 방문 팁 카드는 콘텐츠 패딩이 16 이다. */}
              <CardBody className="p-4">
                <CardTitle>작성자의 한 줄 팁</CardTitle>
                <CardDescription>{place.tip}</CardDescription>
              </CardBody>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-22">{locationBlock}</aside>
        </div>
      </Container>
    </AppShell>
  );
}
