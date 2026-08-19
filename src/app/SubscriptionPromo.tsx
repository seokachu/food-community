"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { NarrowColumn } from "@/components/layout/Container";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { SubscriptionBanner } from "@/components/ui/SubscriptionBanner";

/** `구독하면 함께 만드는 것` 항목. design.pen 구독 안내(xZUmN) 문구 그대로다. */
const VALUE_ITEMS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "search",
    title: "숨은 맛집 발굴",
    body: "운영팀의 지역 탐색과 좋은 콘텐츠 확보를 지원해요.",
  },
  {
    icon: "shield-check",
    title: "광고 없는 운영",
    body: "협찬 순위 대신 이웃의 솔직한 기록을 지켜요.",
  },
  {
    icon: "sparkles",
    title: "멤버 전용 혜택",
    body: "Standard·Premium 혜택은 확정되는 즉시 공개해요.",
  },
];

/** `구독료는 이렇게 쓰여요` 항목. */
const PROMISE_ITEMS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "map-pin",
    title: "지역 탐색",
    body: "구로에서 차로 갈 만한 새로운 장소를 직접 찾고 검증해요.",
  },
  {
    icon: "image",
    title: "콘텐츠 품질",
    body: "사진과 주소, 주차 정보를 더 정확하게 관리해요.",
  },
];

/**
 * 메인의 구독 배너와, 배너를 눌렀을 때 뜨는 구독 안내 바텀시트.
 * 시트 내용은 design.pen `구독 안내`(xZUmN) 화면을 그대로 옮겼고,
 * [요금제 확인하기]가 구독 결제 페이지로 잇는다.
 */
export function SubscriptionPromo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SubscriptionBanner
        eyebrow="구독 멤버십"
        title="광고 없이, 더 좋은 숨은 맛집을 오래"
        description="구독료는 지역 탐색과 광고 없는 운영에 쓰여요"
        onClick={() => setOpen(true)}
      />

      <BottomSheet open={open} label="구독 안내" onClose={() => setOpen(false)}>
        {/* 시트 키가 화면을 넘으면 시트 안에서만 스크롤한다. */}
        <NarrowColumn className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto">
          <header className="flex flex-col gap-2">
            <h2 className="text-heading-lg text-text-default">
              광고 없이, 더 좋은 숨은 맛집을 오래
            </h2>
            <p className="text-body-md text-text-secondary">
              구독은 단순한 기능 구매가 아니라 지역의 좋은 맛집을 꾸준히
              발굴하고, 광고 없는 커뮤니티를 운영하기 위한 멤버십이에요.
            </p>
          </header>

          <section className="bg-background-brand-subtle border-border-brand flex flex-col gap-3 rounded-2xl border p-4">
            <header className="flex items-center gap-2">
              <Icon name="heart" size={16} className="text-icon-brand" />
              <h3 className="text-heading-sm text-text-default">
                구독하면 함께 만드는 것
              </h3>
            </header>
            {VALUE_ITEMS.map((item) => (
              <div key={item.title} className="flex gap-2.5">
                <span className="bg-background-elevated flex size-7 shrink-0 items-center justify-center rounded-lg">
                  <Icon name={item.icon} size={16} className="text-icon-brand" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-lg text-text-default">{item.title}</p>
                  <p className="text-label-md text-text-secondary">{item.body}</p>
                </div>
              </div>
            ))}
            <InlineNotice tone="warning">
              가격과 개인 혜택이 확정되기 전에는 실제 결제가 진행되지 않아요.
            </InlineNotice>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-heading-md text-text-default">
              구독료는 이렇게 쓰여요
            </h3>
            {PROMISE_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="bg-background-subtle flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Icon name={item.icon} size={20} className="text-icon-brand" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-lg text-text-default">{item.title}</p>
                  <p className="text-label-md text-text-secondary">{item.body}</p>
                </div>
              </div>
            ))}
          </section>

          <Button
            as={Link}
            href="/subscription"
            size="lg"
            fullWidth
            rightIcon="arrow-right"
          >
            요금제 확인하기
          </Button>
        </NarrowColumn>
      </BottomSheet>
    </>
  );
}
