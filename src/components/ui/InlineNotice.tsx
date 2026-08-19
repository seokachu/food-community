import type { ReactNode } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * 본문 흐름 안에 상시 놓이는 안내 박스. design.pen 의
 * `혜택 확정 전 결제 안내`(warning)와 `결제 정책 안내`(neutral) 두 톤이다.
 * 이벤트에 반응해 떴다 사라지는 Toast 와 역할이 다르다.
 */
export type InlineNoticeTone = "warning" | "neutral";

const toneClass: Record<
  InlineNoticeTone,
  { box: string; icon: string; text: string }
> = {
  warning: {
    box: "bg-background-warning-subtle",
    icon: "text-icon-warning",
    text: "text-text-warning",
  },
  neutral: {
    box: "bg-background-subtle",
    icon: "text-icon-secondary",
    text: "text-text-muted",
  },
};

export interface InlineNoticeProps {
  tone?: InlineNoticeTone;
  className?: string;
  children: ReactNode;
}

export function InlineNotice({
  tone = "neutral",
  className,
  children,
}: InlineNoticeProps) {
  const classes = toneClass[tone];

  return (
    <div className={cn("flex w-full gap-2 rounded-xl p-3", classes.box, className)}>
      <Icon
        name="info"
        size={16}
        className={cn("mt-0.5 shrink-0", classes.icon)}
      />
      <p className={cn("text-label-md", classes.text)}>{children}</p>
    </div>
  );
}
