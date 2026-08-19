"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlanCard } from "@/components/ui/PlanCard";
import { PLANS, VIEWER_PLAN_ID, type PlanId } from "@/lib/subscription";

/**
 * 요금제 카드 목록 + 모의 결제. 실제 PG 는 가격 확정(Q8) 전이라 붙이지 않고,
 * [구독하기]가 진행 상태(스피너·중복 클릭 방지, PRD F6)를 거쳐
 * 결제 완료 화면으로 이동하는 것까지만 구현한다.
 */
export function PlanList() {
  const router = useRouter();
  const [payingId, setPayingId] = useState<PlanId | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const subscribe = (id: PlanId) => {
    // 결제 진행 중에는 어떤 플랜도 다시 누를 수 없다 (중복 결제 방지).
    if (payingId) return;
    setPayingId(id);
    timer.current = setTimeout(() => {
      router.push(`/subscription/complete?plan=${id}`);
    }, 900);
  };

  return (
    <div className="flex flex-col gap-3">
      {PLANS.map((plan) => {
        const isCurrent = plan.id === VIEWER_PLAN_ID;

        return (
          <PlanCard
            key={plan.id}
            name={plan.name}
            badge={
              isCurrent ? (
                <Badge tone="success">이용 중</Badge>
              ) : plan.recommended ? (
                <Badge tone="info">추천</Badge>
              ) : undefined
            }
            price={plan.price}
            period={plan.period}
            benefit={plan.benefit}
            highlighted={plan.recommended}
            action={
              // 이용 중인 플랜은 결제 버튼 자체가 없다 (시안 · PRD F6).
              isCurrent ? undefined : (
                <Button
                  fullWidth
                  loading={payingId === plan.id}
                  disabled={payingId !== null && payingId !== plan.id}
                  onClick={() => subscribe(plan.id)}
                >
                  구독하기
                </Button>
              )
            }
          />
        );
      })}
    </div>
  );
}
