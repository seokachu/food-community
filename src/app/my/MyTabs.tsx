"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CurrentPlanCard } from "@/components/ui/CurrentPlanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { Modal } from "@/components/ui/Modal";
import { ReceiptRow } from "@/components/ui/ReceiptRow";
import { TabNavigation } from "@/components/ui/TabNavigation";
import { Toast } from "@/components/ui/Toast";
import {
  MOCK_PAYMENTS,
  PLAN_SUMMARY,
  toCancellation,
  type CancellationRecord,
  type PaymentRecord,
} from "@/lib/subscription";

import { MyPostList, type MyPost } from "./MyPostList";

export type MyTabId = "posts" | "payments" | "cancellations";

const TAB_ITEMS: { id: MyTabId; label: string }[] = [
  { id: "posts", label: "내가 쓴 글" },
  { id: "payments", label: "결제내역" },
  { id: "cancellations", label: "취소내역" },
];

export interface MyTabsProps {
  /** 결제 완료 화면이 `/my?tab=payments` 로 넘겨준다. 기본은 내가 쓴 글(PRD F5-1). */
  initialTab: MyTabId;
  /** 내가 쓴 글 조회 실패(rows === null) 여부. 빈 목록과 구분한다. */
  postsFailed: boolean;
  posts: MyPost[];
}

/**
 * design.pen `마이페이지 v1.1` 의 현재 플랜 카드 + 탭 메뉴(내가 쓴 글 · 결제내역 · 취소내역).
 *
 * 결제·취소내역은 UI 핸드오프 단계라 클라이언트 목데이터로만 움직인다.
 * 시안의 `Standard 구독 + 결제 1건` 상태에서 시작해, 결제 취소를 확정하면
 * 취소내역 시안 상태(Free 복귀 + 환불 처리 중)로 넘어간다.
 */
export function MyTabs({ initialTab, postsFailed, posts }: MyTabsProps) {
  const [tab, setTab] = useState<MyTabId>(initialTab);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [cancellations, setCancellations] = useState<CancellationRecord[]>([]);
  const [cancelTarget, setCancelTarget] = useState<PaymentRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 유료 결제 건이 남아 있으면 Standard, 취소하고 나면 Free 로 돌아간다.
  const plan = payments.length ? PLAN_SUMMARY.standard : PLAN_SUMMARY.free;

  const confirmCancel = () => {
    if (!cancelTarget) return;
    setPayments((prev) =>
      prev.filter((payment) => payment.orderNo !== cancelTarget.orderNo),
    );
    setCancellations((prev) => [toCancellation(cancelTarget), ...prev]);
    setCancelTarget(null);
    setToast("결제가 취소됐어요. 환불 상태는 취소내역 탭에서 볼 수 있어요.");
  };

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <Toast tone="success" message={toast} onClose={() => setToast(null)} />
      )}

      <CurrentPlanCard
        planName={plan.name}
        description={plan.description}
        manageHref="/subscription"
      />

      <TabNavigation
        items={TAB_ITEMS}
        activeId={tab}
        onChange={(id) => setTab(id as MyTabId)}
      />

      {tab === "posts" && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md text-text-default">내가 쓴 글</h2>
            <Badge>{posts.length}개</Badge>
          </header>

          {postsFailed ? (
            <EmptyState
              icon="warning"
              title="목록을 불러오지 못했어요"
              description="잠시 후 새로고침 해주세요."
              className="border-border-default rounded-2xl border"
            />
          ) : posts.length ? (
            <MyPostList posts={posts} />
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
      )}

      {tab === "payments" && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md text-text-default">결제내역</h2>
            <Badge>{payments.length}건</Badge>
          </header>

          {payments.length === 0 ? (
            <EmptyState
              icon="receipt"
              title="결제 내역이 없어요"
              description="구독을 시작하면 결제 내역이 여기에 모여요."
              className="border-border-default rounded-2xl border"
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {payments.map((payment) => (
                <li key={payment.orderNo}>
                  <article className="bg-background-default border-border-default flex flex-col gap-3.5 rounded-2xl border p-4">
                    <header className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-heading-sm text-text-default">
                          {payment.planName}
                        </h3>
                        <p className="text-label-md text-text-muted">
                          {payment.orderNo}
                        </p>
                      </div>
                      <Badge tone="success">결제 완료</Badge>
                    </header>

                    <div className="border-border-subtle flex flex-col gap-2 border-t pt-3">
                      <ReceiptRow label="결제일" value={payment.paidOn} />
                      <ReceiptRow label="결제 금액" value={payment.amount} />
                      <ReceiptRow label="이용 기간" value={payment.period} />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        href={`/subscription/complete?plan=${
                          payment.planName.startsWith("Premium")
                            ? "premium"
                            : "standard"
                        }`}
                        variant="secondary"
                        size="sm"
                        fullWidth
                        className="flex-1"
                      >
                        영수증 보기
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        fullWidth
                        className="flex-1"
                        onClick={() => setCancelTarget(payment)}
                      >
                        결제 취소
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "cancellations" && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md text-text-default">취소내역</h2>
            <Badge>{cancellations.length}건</Badge>
          </header>

          {cancellations.length === 0 ? (
            <EmptyState
              icon="refresh"
              title="취소 내역이 없어요"
              description="결제를 취소하면 환불 상태를 여기에서 볼 수 있어요."
              className="border-border-default rounded-2xl border"
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {cancellations.map((cancellation) => (
                <li key={cancellation.orderNo}>
                  <article className="bg-background-default border-border-default flex flex-col gap-3.5 rounded-2xl border p-4">
                    <header className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-heading-sm text-text-default">
                          {cancellation.planName}
                        </h3>
                        <p className="text-label-md text-text-muted">
                          {cancellation.orderNo}
                        </p>
                      </div>
                      <Badge tone="warning">처리 중</Badge>
                    </header>

                    <div className="border-border-subtle flex flex-col gap-2 border-t pt-3">
                      <ReceiptRow label="결제일" value={cancellation.paidOn} />
                      <ReceiptRow
                        label="취소일"
                        value={cancellation.canceledOn}
                      />
                      <ReceiptRow label="환불 금액" value={cancellation.refund} />
                    </div>

                    <InlineNotice tone="warning">
                      PG 처리 완료 후 결제 수단으로 환불돼요.
                    </InlineNotice>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* 결제 취소 확인 — 확인해야만 취소된다(PRD F5-1). */}
      <Modal
        open={cancelTarget !== null}
        title="결제를 취소할까요?"
        onClose={() => setCancelTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              닫기
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              결제 취소
            </Button>
          </>
        }
      >
        <p>{cancelTarget?.planName} 구독을 취소합니다.</p>
        <p className="mt-4">
          예상 환불 금액은 환불 정책 확정 후 계산되며, 취소가 완료되면 혜택
          종료 시점도 정책에 따라 적용돼요.
        </p>
      </Modal>
    </div>
  );
}
