import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Icon } from "@/components/foundation/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CurrentPlanCard } from "@/components/ui/CurrentPlanCard";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { PlanCard } from "@/components/ui/PlanCard";
import { ReceiptRow } from "@/components/ui/ReceiptRow";
import { SubscriptionBanner } from "@/components/ui/SubscriptionBanner";

/**
 * 구독 결제(v1.1) 화면들이 쓰는 조각 모음.
 * design.pen `구독 안내` · `구독 결제` · `결제 완료` · `마이페이지 v1.1` 시안 대응.
 */
const meta = {
  title: "UI/Subscription",
  component: PlanCard,
  parameters: { layout: "padded" },
  args: {
    name: "Free",
    price: "0원",
    period: "· 기간 제한 없음",
    benefit: "기본 기능 전체",
  },
} satisfies Meta<typeof PlanCard>;

export default meta;
type Story = StoryObj<typeof PlanCard>;

/** 메인 상단의 구독 홍보 배너. 누르면 구독 안내 바텀시트를 연다. */
export const Banner: Story = {
  render: () => (
    <div className="bg-background-default max-w-[420px] p-6">
      <SubscriptionBanner
        eyebrow="구독 멤버십"
        title="광고 없이, 더 좋은 숨은 맛집을 오래"
        description="구독료는 지역 탐색과 광고 없는 운영에 쓰여요"
      />
    </div>
  ),
};

/** 요금제 비교의 세 카드. Standard 는 추천 강조(브랜드 서브틀 + 2px 보더). */
export const PlanCards: Story = {
  render: () => (
    <div className="bg-background-default flex max-w-[420px] flex-col gap-3 p-6">
      <PlanCard
        name="Free"
        badge={<Badge tone="success">이용 중</Badge>}
        price="0원"
        period="· 기간 제한 없음"
        benefit="기본 기능 전체"
      />
      <PlanCard
        name="Standard"
        badge={<Badge tone="info">추천</Badge>}
        price="가격 확정 예정"
        period="· 30일"
        benefit="혜택 확정 예정"
        highlighted
        action={<Button fullWidth>구독하기</Button>}
      />
      <PlanCard
        name="Premium"
        price="가격 확정 예정"
        period="· 30일"
        benefit="Standard 상위 혜택 · 확정 예정"
        action={<Button fullWidth>구독하기</Button>}
      />
    </div>
  ),
};

/** 마이페이지 상단의 현재 플랜 카드. Free / Standard 두 상태. */
export const CurrentPlan: Story = {
  render: () => (
    <div className="bg-background-default flex max-w-[420px] flex-col gap-3 p-6">
      <CurrentPlanCard
        planName="Free"
        description="기본 기능을 기간 제한 없이 이용 중이에요"
        manageHref="/subscription"
      />
      <CurrentPlanCard
        planName="Standard"
        description="2026.09.11까지 이용할 수 있어요"
        manageHref="/subscription"
      />
    </div>
  ),
};

/** 결제 완료 영수증. 헤더 + 구분선 + 행 목록 조합의 기준 사용례다. */
export const Receipt: Story = {
  render: () => (
    <div className="bg-background-default max-w-[420px] p-6">
      <section className="border-border-default bg-background-default flex flex-col gap-4 rounded-2xl border p-5">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="receipt" size={20} className="text-icon-brand" />
            <h3 className="text-heading-sm text-text-default">결제 영수증</h3>
          </div>
          <Badge tone="success">결제 완료</Badge>
        </header>
        <hr className="border-border-subtle" />
        <div className="flex flex-col gap-2.5">
          <ReceiptRow label="플랜" value="Standard 30일" strong />
          <ReceiptRow label="결제 금액" value="가격 확정 예정" strong />
          <ReceiptRow label="결제 수단" value="카드 (•••• 1234)" />
          <ReceiptRow label="결제 일시" value="2026.08.13 14:32" />
          <ReceiptRow label="이용 기간" value="2026.08.13 ~ 09.11" />
          <ReceiptRow label="주문 번호" value="ORD-20260813-0182" />
        </div>
      </section>
    </div>
  ),
};

/** 흐름 안에 상시 놓이는 안내 박스 두 톤. */
export const Notices: Story = {
  render: () => (
    <div className="bg-background-default flex max-w-[420px] flex-col gap-3 p-6">
      <InlineNotice tone="warning">
        가격과 개인 혜택이 확정되기 전에는 실제 결제가 진행되지 않아요.
      </InlineNotice>
      <InlineNotice tone="neutral">
        유료 플랜은 30일 이용권이에요. 자동 갱신·플랜 변경·환불 정책은 확정 후
        결제 전에 안내됩니다.
      </InlineNotice>
    </div>
  ),
};
