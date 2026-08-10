import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { Icon } from "@/components/foundation/Icon";
import { BrandMark } from "@/components/ui/BrandMark";
import { SocialSignInButton } from "@/components/ui/SocialSignInButton";
import { signInWithGoogle } from "@/lib/auth/actions";
import { safeNextPath } from "@/lib/auth/next-path";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "로그인 · 숨은맛집",
  description: "구로에서 차로 한 시간, 광고 없이 직접 다녀온 맛집 이야기.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next: rawNext } = await searchParams;
  // 로그인 후 돌아갈 경로. 보호된 화면이 ?next= 로 넘겨준다(PRD F1).
  const next = safeNextPath(rawNext);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect(next);
  }

  return (
    // 로그인은 전역 내비게이션 없이 단독으로 선다. 시안도 탭바가 없다.
    <AppShell showNavigation={false}>
      <Container className="flex flex-1 flex-col pt-16 pb-8 md:justify-center md:py-16">
        <NarrowColumn className="flex flex-1 flex-col items-center justify-between gap-12 md:flex-none md:gap-16">
          <header className="flex w-full flex-col items-center gap-5">
            <BrandMark size={64} />
            <div className="flex flex-col items-center gap-2.5 text-center">
              <h1 className="text-display-md text-text-default">
                주말의 숨은 한 끼를
                <br />
                함께 찾아요
              </h1>
              {/* 280px 는 시안이 정한 문구 폭이다. 레이아웃 컬럼이 아니라 텍스트 measure. */}
              <p className="text-body-md text-text-secondary max-w-[280px]">
                구로에서 차로 한 시간, 광고 없이 직접 다녀온 맛집 이야기만
                모았어요.
              </p>
            </div>
          </header>

          <div className="flex w-full flex-col items-center gap-3.5">
            {error && (
              <p role="alert" className="text-body-md text-text-error text-center">
                로그인에 실패했어요. 잠시 후 다시 시도해주세요.
              </p>
            )}

            <form action={signInWithGoogle.bind(null, next)} className="w-full">
              <SocialSignInButton type="submit" />
            </form>

            <Link
              href="/"
              className="text-body-md text-text-secondary hover:text-text-default focus-visible:outline-border-brand inline-flex items-center gap-1.5 rounded-lg px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              로그인 없이 둘러보기
              <Icon name="arrow-right" size={20} className="text-current" />
            </Link>

            <p className="text-label-md text-text-muted max-w-[280px] text-center">
              계속하면 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
