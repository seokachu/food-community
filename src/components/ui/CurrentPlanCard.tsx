import Link from "next/link";

import { cn } from "@/lib/cn";

import { Button } from "./Button";

/**
 * design.pen 마이페이지 v1.1 의 `현재 구독 플랜` 카드.
 * [구독 관리]는 구독 결제(요금제 비교) 페이지로 가는 링크다(PRD F5).
 */
export interface CurrentPlanCardProps {
  planName: string;
  description: string;
  manageHref: string;
  className?: string;
}

export function CurrentPlanCard({
  planName,
  description,
  manageHref,
  className,
}: CurrentPlanCardProps) {
  return (
    <section
      className={cn(
        "bg-background-brand-subtle border-border-brand flex w-full flex-col gap-2.5 rounded-[14px] border p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-label-md text-text-muted">현재 플랜</span>
          <span className="text-heading-sm text-text-default">{planName}</span>
        </div>
        <Button
          as={Link}
          href={manageHref}
          variant="secondary"
          size="sm"
          rightIcon="chevron-right"
        >
          구독 관리
        </Button>
      </div>
      <p className="text-label-md text-text-secondary">{description}</p>
    </section>
  );
}
