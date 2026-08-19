/**
 * 구독 결제(v1.1) 목데이터. PRD Q8·Q9(가격·혜택 미정)에 따라 실제 결제·DB 없이
 * UI만 핸드오프하는 단계라, 시안(design.pen)의 문구를 그대로 상수로 둔다.
 * 가격·정책이 확정되고 PG 연동이 시작되면 이 모듈이 BFF 호출로 대체된다.
 */

export type PlanId = "free" | "standard" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  /** "0원" 또는 "가격 확정 예정". 숫자가 아니라 시안 문구 그대로다. */
  price: string;
  period: string;
  benefit: string;
  /** 시안의 `추천` 배지 + 브랜드 강조 테두리가 붙는 플랜. */
  recommended?: boolean;
}

/** 구독 결제 페이지(요금제 비교)의 세 플랜. 순서도 시안 순서다. */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "0원",
    period: "· 기간 제한 없음",
    benefit: "기본 기능 전체",
  },
  {
    id: "standard",
    name: "Standard",
    price: "가격 확정 예정",
    period: "· 30일",
    benefit: "혜택 확정 예정",
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "가격 확정 예정",
    period: "· 30일",
    benefit: "Standard 상위 혜택 · 확정 예정",
  },
];

/** 요금제 비교 화면이 가정하는 열람자. 시안(구독 결제)은 Free 이용자 기준이다. */
export const VIEWER_PLAN_ID: PlanId = "free";

export interface Receipt {
  planName: string;
  amount: string;
  method: string;
  paidAt: string;
  period: string;
  orderNo: string;
}

/** 결제 완료 화면의 영수증. 모의 결제라 시안 값을 그대로 쓴다. */
export const MOCK_RECEIPTS: Record<"standard" | "premium", Receipt> = {
  standard: {
    planName: "Standard 30일",
    amount: "가격 확정 예정",
    method: "카드 (•••• 1234)",
    paidAt: "2026.08.13 14:32",
    period: "2026.08.13 ~ 09.11",
    orderNo: "ORD-20260813-0182",
  },
  premium: {
    planName: "Premium 30일",
    amount: "가격 확정 예정",
    method: "카드 (•••• 1234)",
    paidAt: "2026.08.13 14:32",
    period: "2026.08.13 ~ 09.11",
    orderNo: "ORD-20260813-0195",
  },
};

export interface PaymentRecord {
  orderNo: string;
  planName: string;
  paidOn: string;
  amount: string;
  period: string;
}

export interface CancellationRecord {
  orderNo: string;
  planName: string;
  paidOn: string;
  canceledOn: string;
  refund: string;
}

/**
 * 마이페이지 결제내역 초기 상태. 시안(마이페이지 결제내역)과 같은
 * `Standard 구독 중 · 결제 1건` 시나리오에서 시작해, 결제 취소를 실행하면
 * 취소내역 시안 상태(Free 복귀 + 환불 처리 중)로 넘어간다.
 */
export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    orderNo: "ORD-20260813-0182",
    planName: "Standard 30일",
    paidOn: "2026.08.13",
    amount: "가격 확정 예정",
    period: "08.13 ~ 09.11",
  },
];

/** 결제 취소가 확정됐을 때 취소내역에 쌓이는 형태. 취소일도 시안 값이다. */
export function toCancellation(payment: PaymentRecord): CancellationRecord {
  return {
    orderNo: payment.orderNo,
    planName: payment.planName,
    paidOn: payment.paidOn,
    canceledOn: "2026.08.20",
    refund: "정책 확정 후 계산",
  };
}

/** 현재 플랜 카드(마이페이지)의 문구. */
export const PLAN_SUMMARY: Record<"free" | "standard", { name: string; description: string }> = {
  free: {
    name: "Free",
    description: "기본 기능을 기간 제한 없이 이용 중이에요",
  },
  standard: {
    name: "Standard",
    description: "2026.09.11까지 이용할 수 있어요",
  },
};
