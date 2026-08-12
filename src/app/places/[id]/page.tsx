import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { MapPreview } from "@/components/ui/MapPreview";
import { NaverMap } from "@/components/ui/NaverMap";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { getProfile } from "@/lib/auth/profile";
import { parsePlaceId } from "@/lib/place-rules";
import { getPlaceRow, toPlaceView, type PlaceView } from "@/lib/place/service";
import { getPlace, PLACES } from "@/lib/places";
import { PROFILE_IMAGE_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/server";

/** generateMetadata 와 본문이 같은 글을 두 번 조회하지 않도록 요청 단위로 묶는다. */
const loadDbPlace = cache(async (id: number) => {
  const supabase = await createClient();
  const row = await getPlaceRow(supabase, id);
  if (!row) return null;

  // 닉네임·사진은 profile 테이블이 정답. 행이 없으면(첫 로그인 직후 등) 기본값으로 둔다.
  // 보는 사람이 작성자면 수정 진입점을 보여주기 위해 세션 클레임도 함께 읽는다.
  const [profile, { data: claimsData }] = await Promise.all([
    getProfile(supabase, row.user_id),
    supabase.auth.getClaims(),
  ]);
  return {
    place: toPlaceView(row),
    authorNickname: profile?.nickname ?? "이웃 미식가",
    authorImageUrl: profile?.imagePath
      ? publicStorageUrl(PROFILE_IMAGE_BUCKET, profile.imagePath)
      : null,
    isOwner: claimsData?.claims?.sub === row.user_id,
  };
});

/** 목데이터 세 곳은 빌드 타임에 미리 만든다. DB 글(숫자 id)은 요청 시점에 그린다. */
export function generateStaticParams() {
  return PLACES.map((place) => ({ id: place.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbId = parsePlaceId(id);

  if (dbId !== null) {
    const loaded = await loadDbPlace(dbId);
    return {
      title: loaded ? `${loaded.place.title} · 숨은맛집` : "숨은맛집",
      description: loaded?.place.content.slice(0, 80),
    };
  }

  const place = getPlace(id);
  return {
    title: place ? `${place.name} · 숨은맛집` : "숨은맛집",
    description: place?.summary,
  };
}

/** 카드 작성일 표기. 시안 형식(2026.08.01)에 맞춘다. */
function formatWrittenOn(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

/** DB 에 등록된 글의 상세 화면. 위치 블록은 저장된 좌표의 실지도에 마커를 찍는다. */
function DbPlaceDetail({
  place,
  authorNickname,
  authorImageUrl,
  isOwner,
}: {
  place: PlaceView;
  authorNickname: string;
  authorImageUrl: string | null;
  /** 작성자 본인이면 수정 진입점을 보여준다. 서버(수정 페이지·PATCH)가 다시 검증한다. */
  isOwner: boolean;
}) {
  const heroUrl = place.images[0]?.url;
  const paragraphs = place.content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  // 지도 연동 전에 등록된 옛 글에는 좌표가 없어 도형 자리표시자로 대신한다.
  const coord =
    place.lat !== null && place.lng !== null
      ? { lat: place.lat, lng: place.lng }
      : null;

  const locationBlock = (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-heading-md text-text-default">위치</h2>
        <Button variant="secondary" size="sm" leftIcon="copy">
          주소 복사
        </Button>
      </header>
      <div className="flex flex-col gap-1">
        {place.name && (
          <p className="text-label-lg text-text-default">{place.name}</p>
        )}
        <p className="text-body-md text-text-secondary">{place.address}</p>
      </div>
      {coord ? (
        <NaverMap
          clientId={process.env.NAVER_MAP_CLIENT_ID ?? ""}
          center={coord}
          marker={coord}
          centerPin={false}
          interactive={false}
          zoom={16}
          className="h-[190px] rounded-2xl"
        />
      ) : (
        <MapPreview caption={place.name ?? undefined} />
      )}
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
          trailing={
            isOwner ? (
              <IconButton
                as={Link}
                href={`/places/${place.id}/edit`}
                icon="edit"
                label="수정하기"
              />
            ) : (
              <IconButton icon="more-horizontal" label="더보기" />
            )
          }
        />
      }
    >
      <Container className="md:pt-6">
        {/* -mx-4 로 모바일에서만 Container 거터를 상쇄해 화면 끝까지 채운다. */}
        <div
          role="img"
          aria-label={`${place.title} 사진`}
          style={{ backgroundImage: heroUrl ? `url(${heroUrl})` : undefined }}
          className="bg-background-disabled relative -mx-4 h-[278px] bg-cover bg-center md:mx-0 md:aspect-[21/9] md:h-auto md:rounded-2xl"
        >
          {place.images.length > 0 && (
            <span className="bg-background-overlay text-label-lg text-text-on-inverse absolute right-4 bottom-4 flex h-7 items-center rounded-full px-3">
              1 / {place.images.length}
            </span>
          )}
        </div>
      </Container>

      <Container className="flex flex-col gap-6 py-6 md:gap-10 md:py-10">
        {/* 데스크톱 전용 뒤로가기·수정. 모바일 TopNavigation 이 감춰진 자리를 대신한다. */}
        <div className="hidden items-center justify-between gap-4 md:flex">
          <Link
            href="/"
            className="text-label-lg text-text-secondary hover:text-text-default inline-flex w-fit items-center gap-1"
          >
            ← 목록으로
          </Link>
          {isOwner && (
            <Button
              as={Link}
              href={`/places/${place.id}/edit`}
              variant="secondary"
              size="sm"
              leftIcon="edit"
            >
              수정하기
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <h1 className="text-display-sm lg:text-display-md text-text-default">
                {place.title}
              </h1>
              <div className="flex items-center gap-2">
                <Avatar size={28} src={authorImageUrl ?? undefined} />
                <p className="text-label-md text-text-secondary">
                  {authorNickname} · {formatWrittenOn(place.createdAt)}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-heading-md text-text-default">
                여기, 이런 곳이에요
              </h2>
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-body-md lg:text-body-lg text-text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          </div>

          <aside className="lg:sticky lg:top-22">{locationBlock}</aside>
        </div>
      </Container>
    </AppShell>
  );
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 숫자 id 는 DB 에 등록된 글이다. 없거나 소프트삭제됐으면 404.
  const dbId = parsePlaceId(id);
  if (dbId !== null) {
    const loaded = await loadDbPlace(dbId);
    if (!loaded) notFound();
    return (
      <DbPlaceDetail
        place={loaded.place}
        authorNickname={loaded.authorNickname}
        authorImageUrl={loaded.authorImageUrl}
        isOwner={loaded.isOwner}
      />
    );
  }

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
      {place.mapImage ? (
        <MapPreview
          variant="image"
          src={place.mapImage}
          alt={`${place.name} 위치 지도`}
          className="h-[190px] rounded-2xl"
        />
      ) : (
        <MapPreview caption={place.mapCaption} />
      )}
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
