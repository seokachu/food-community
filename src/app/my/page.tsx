import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { signOut } from "@/lib/auth/actions";
import { avatarUrlOf, getProfile, toProfileView } from "@/lib/auth/profile";
import { getUserPlaceRows, toPlaceView } from "@/lib/place/service";
import { createClient } from "@/lib/supabase/server";

import { MyTabs, type MyTabId } from "./MyTabs";
import { ProfileSection } from "./ProfileSection";

export const metadata = {
  title: "마이 페이지 · 숨은맛집",
  description: "내 정보, 내가 쓴 글, 결제·취소 내역을 한곳에서 관리합니다.",
};

/** 카드 작성일 표기. 시안 형식(2026.08.01)에 맞춘다. */
function formatWrittenOn(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

/** `/my?tab=payments` 같은 쿼리를 탭 id 로 좁힌다. 그 외 값은 기본 탭. */
function toTabId(tab: string | undefined): MyTabId {
  return tab === "payments" || tab === "cancellations" ? tab : "posts";
}

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

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

  // 내가 쓴 글 — 소프트삭제 제외 최신순. 실패(null)와 빈 목록을 구분해 보여준다.
  const rows = await getUserPlaceRows(supabase, userId);
  const posts = (rows ?? []).map(toPlaceView).map((place) => ({
    id: place.id,
    title: place.title,
    meta: `${formatWrittenOn(place.createdAt)} · ${place.address.split(" ").slice(0, 3).join(" ")}`,
    thumbnailUrl: place.images[0]?.url,
  }));

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

        {/* v1.1 — 현재 플랜 카드 + 내가 쓴 글 · 결제내역 · 취소내역 탭 */}
        <MyTabs
          initialTab={toTabId(tab)}
          postsFailed={rows === null}
          posts={posts}
        />

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
