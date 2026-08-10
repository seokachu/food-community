import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * design.pen `Badge/<tone>/<size>` 10개에 대응한다.
 *
 * `brand` 는 .pen 컴포넌트 목록에는 없고 마이페이지 시안의
 * `Google 계정 연결됨` 배지가 쓰는 조합이다. 같은 모양이 다시 필요할 때를 위해
 * 인라인으로 두지 않고 톤으로 올렸다.
 */
export type BadgeTone =
  | "neutral"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "brand";
export type BadgeSize = "md" | "lg";

/**
 * neutral 만 채움(inverse 배경 + 밝은 글자)이고 나머지 톤은
 * 배경 없이 테두리와 글자색으로만 구분한다. design.pen 그대로다.
 */
const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-background-inverse border-border-strong text-text-on-inverse",
  success: "bg-background-default border-border-success text-text-success",
  error: "bg-background-default border-border-error text-text-error",
  info: "bg-background-default border-border-info text-text-info",
  warning: "bg-background-default border-border-warning text-text-warning",
  brand: "bg-background-brand-subtle border-border-brand text-text-brand",
};

/** 좌우 패딩은 두 사이즈 모두 8px 이고 높이만 다르다. */
const sizeClass: Record<BadgeSize, string> = { md: "h-5", lg: "h-6" };

export interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  size = "md",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "text-label-md inline-flex w-fit shrink-0 items-center justify-center rounded-full border px-2 whitespace-nowrap",
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
