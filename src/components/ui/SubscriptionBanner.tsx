import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * 메인 상단의 구독 홍보 배너.
 *
 * design.pen 에 단독 컴포넌트는 없다. `맛집 등록 유도` 배너의 구조
 * (문구 묶음 + 우측 원형 아이콘)에 구독 안내(xZUmN) 화면의 브랜드 서브틀 톤을
 * 입혀 만들었다. 눌렀을 때 페이지 이동이 아니라 구독 안내 바텀시트를 열어야
 * 해서 링크가 아니라 버튼이다.
 */
export interface SubscriptionBannerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** 제목 위에 작게 얹는 브랜드 레이블. 예: "구독 멤버십" */
  eyebrow?: string;
  title: string;
  description?: string;
  /** 우측 원 안의 장식 아이콘. */
  icon?: IconName;
}

export function SubscriptionBanner({
  eyebrow,
  title,
  description,
  icon = "heart",
  className,
  ...props
}: SubscriptionBannerProps) {
  return (
    <button
      type="button"
      className={cn(
        "bg-background-brand-subtle border-border-brand flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left md:px-8 md:py-6",
        "hover:bg-background-brand-soft focus-visible:outline-border-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-col gap-1">
        {eyebrow && (
          <span className="text-label-md text-text-brand">{eyebrow}</span>
        )}
        <span className="text-heading-sm text-text-default">{title}</span>
        {description && (
          <span className="text-label-md text-text-secondary">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="bg-background-brand-soft flex size-12 shrink-0 items-center justify-center rounded-full"
      >
        <Icon name={icon} size={24} className="text-icon-brand" />
      </span>
    </button>
  );
}
