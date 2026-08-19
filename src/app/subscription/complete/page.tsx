import Link from "next/link";

import { Icon } from "@/components/foundation/Icon";
import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReceiptRow } from "@/components/ui/ReceiptRow";
import { MOCK_RECEIPTS } from "@/lib/subscription";

export const metadata = {
  title: "결제 완료 · 숨은맛집",
  description: "구독 결제 영수증을 확인합니다.",
};

/**
 * design.pen `결제 완료` 화면. 시안처럼 전역 내비게이션 없이 단독으로 서고,
 * 하단 [확인]이 마이페이지 결제내역 탭으로 잇는다(PRD 흐름 D).
 * 마이페이지 [영수증 보기]도 이 화면을 다시 연다(PRD F5-1).
 */
export default async function SubscriptionCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const planId = plan === "premium" ? "premium" : "standard";
  const receipt = MOCK_RECEIPTS[planId];
  const planLabel = planId === "premium" ? "Premium" : "Standard";

  return (
    <AppShell showNavigation={false}>
      <Container className="flex flex-1 flex-col py-10 md:py-16">
        <NarrowColumn className="flex flex-1 flex-col gap-6 md:flex-none">
          <header className="flex flex-col items-center gap-3 pt-4 text-center">
            <span className="bg-background-brand-soft flex size-16 items-center justify-center rounded-full">
              <Icon name="check" size={28} className="text-icon-brand" />
            </span>
            <h1 className="text-heading-lg text-text-default">결제 완료</h1>
            <p className="text-body-md text-text-secondary">
              {planLabel} 구독이 시작됐어요
            </p>
          </header>

          <section className="border-border-default bg-background-default flex flex-col gap-4 rounded-2xl border p-5">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Icon name="receipt" size={20} className="text-icon-brand" />
                <h2 className="text-heading-sm text-text-default">결제 영수증</h2>
              </div>
              <Badge tone="success">결제 완료</Badge>
            </header>
            <hr className="border-border-subtle" />
            <div className="flex flex-col gap-2.5">
              <ReceiptRow label="플랜" value={receipt.planName} strong />
              <ReceiptRow label="결제 금액" value={receipt.amount} strong />
              <ReceiptRow label="결제 수단" value={receipt.method} />
              <ReceiptRow label="결제 일시" value={receipt.paidAt} />
              <ReceiptRow label="이용 기간" value={receipt.period} />
              <ReceiptRow label="주문 번호" value={receipt.orderNo} />
            </div>
          </section>

          {/* 시안의 유연 여백 — 모바일에서 CTA 를 화면 아래로 민다. */}
          <div aria-hidden className="flex-1 md:hidden" />

          <Button as={Link} href="/my?tab=payments" size="lg" fullWidth>
            확인 · 결제내역으로 이동
          </Button>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
