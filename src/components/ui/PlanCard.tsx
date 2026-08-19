import type { ReactNode } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * design.pen 구독 결제(요금제 비교) 화면의 요금제 카드.
 * 기본은 1px 카드 보더, highlighted(시안의 Standard)는
 * 브랜드 서브틀 배경 + 2px 브랜드 보더로 강조한다.
 */
export interface PlanCardProps {
  name: string;
  /** 우상단 상태 배지. 예: `<Badge tone="success">이용 중</Badge>` */
  badge?: ReactNode;
  price: string;
  /** 가격 옆에 붙는 기간 문구. 예: "· 30일" */
  period: string;
  benefit: string;
  /** 유료 플랜의 구독하기 버튼 자리. Free 처럼 없으면 생략한다. */
  action?: ReactNode;
  highlighted?: boolean;
  className?: string;
}

export function PlanCard({
  name,
  badge,
  price,
  period,
  benefit,
  action,
  highlighted = false,
  className,
}: PlanCardProps) {
  return (
    <article
      className={cn(
        "flex w-full flex-col gap-3.5 rounded-2xl p-4",
        highlighted
          ? "bg-background-brand-subtle border-border-brand border-2"
          : "bg-background-default border-border-default border",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-heading-md text-text-default">{name}</h3>
        {badge}
      </header>
      <p className="flex items-end gap-2">
        <span className="text-heading-sm text-text-default">{price}</span>
        <span className="text-label-md text-text-muted">{period}</span>
      </p>
      <p className="flex items-center gap-2">
        <Icon name="check" size={16} className="text-icon-brand shrink-0" />
        <span className="text-body-md text-text-secondary">{benefit}</span>
      </p>
      {action}
    </article>
  );
}
