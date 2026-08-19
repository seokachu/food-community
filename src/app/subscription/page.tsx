import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { TopNavigation } from "@/components/ui/TopNavigation";

import { BackButton } from "./BackButton";
import { PlanList } from "./PlanList";

export const metadata = {
  title: "구독 결제 · 숨은맛집",
  description: "Free·Standard·Premium 요금제를 비교하고 구독을 시작합니다.",
};

/**
 * design.pen `구독 결제`(요금제 비교) 화면. 요금제 비교는 비로그인도 볼 수 있어
 * 인증 게이트를 두지 않는다(PRD F6).
 */
export default function SubscriptionPage() {
  return (
    <AppShell
      topNavigation={<TopNavigation title="구독 결제" leading={<BackButton />} />}
    >
      <Container className="py-6 md:py-10">
        <NarrowColumn className="flex flex-col gap-4">
          <header className="flex flex-col gap-2">
            <h2 className="text-heading-lg text-text-default">
              나에게 맞는 플랜을 선택하세요
            </h2>
            <p className="text-body-md text-text-secondary">
              Free는 기간 제한 없이 계속 이용할 수 있어요. 유료 플랜의 가격과
              혜택은 확정 후 공개됩니다.
            </p>
          </header>

          <PlanList />

          <InlineNotice tone="neutral">
            유료 플랜은 30일 이용권이에요. 자동 갱신·플랜 변경·환불 정책은 확정
            후 결제 전에 안내됩니다.
          </InlineNotice>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
