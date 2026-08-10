import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { signOut } from "@/lib/auth/actions";
import { avatarUrlOf, getProfile, toProfileView } from "@/lib/auth/profile";
import { getPlace, MY_POST_IDS } from "@/lib/places";
import { createClient } from "@/lib/supabase/server";

import { ProfileSection } from "./ProfileSection";

export const metadata = {
  title: "마이 페이지 · 숨은맛집",
  description: "내가 남긴 숨은 맛집 이야기를 모아봅니다.",
};

/** 시안의 `12개` 배지. 실제 작성 글 수는 목록보다 많다는 설정이다. */
const TOTAL_POST_COUNT = 12;

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login?next=/my");
  }

  // 닉네임·사진은 사용자가 고칠 수 있는 값이라 profile 테이블이 정답이다.
  // 첫 로그인 직후 등 행이 아직 없을 때만 JWT의 Google 값으로 대체한다.
  const userId = claims.sub as string;
  const profile = await getProfile(supabase, userId);
  const view = toProfileView(profile, claims);
  const avatarUrl =
    view.imageUrl ??
    avatarUrlOf({
      user_metadata: claims.user_metadata as Record<string, unknown> | null,
    });

  const posts = MY_POST_IDS.map((id) => getPlace(id)!);

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="마이 페이지"
          leading={<IconButton as={Link} href="/" icon="arrow-left" label="뒤로가기" />}
        />
      }
    >
      <Container className="flex flex-col gap-6 py-6 md:gap-10 md:py-10">
        {/* 프로필 — 닉네임·사진 변경은 클라이언트 컴포넌트가 BFF를 호출한다 */}
        <ProfileSection nickname={view.nickname} avatarUrl={avatarUrl} />

        {/* 내가 쓴 글 — 1 → 2 → 3열 카드 그리드 */}
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md text-text-default">내가 쓴 글</h2>
            <Badge>{posts.length ? TOTAL_POST_COUNT : 0}개</Badge>
          </header>

          {posts.length ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {posts.map((place) => (
                <li key={place.id} className="flex">
                  <Card as={Link} href={`/places/${place.id}`} className="w-full">
                    <CardMedia
                      src={place.thumbnail}
                      alt={place.name}
                      className="h-26 sm:aspect-[16/9] sm:h-auto"
                    />
                    <CardBody className="p-3 sm:p-4">
                      <CardTitle>{place.name}</CardTitle>
                      <CardDescription>
                        {place.writtenOn} · {place.address.split(" ").slice(0, 3).join(" ")}
                      </CardDescription>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            // 시안의 `마이페이지 빈 상태`. 작성 글이 없으면 이 갈래로 떨어진다.
            <EmptyState
              icon="bookmark"
              title="아직 등록한 맛집이 없어요"
              description="첫 발견을 기록하면 나만의 주말 맛집 지도가 시작돼요."
              actions={
                <Button as={Link} href="/register" leftIcon="plus">
                  첫 맛집 등록하기
                </Button>
              }
              className="border-border-default rounded-2xl border"
            />
          )}
        </section>

        <form action={signOut}>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon="logout"
          >
            로그아웃
          </Button>
        </form>
      </Container>
    </AppShell>
  );
}
