"use client";

import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/** design.pen `Radio/<selection>/<state>/<size>` 8개에 대응한다. */
export type RadioSize = "sm" | "md";

const sizeSpec = {
  sm: { box: "size-4", dot: "size-2" },
  md: { box: "size-5", dot: "size-2.5" },
} as const;

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label: string;
  size?: RadioSize;
}

/**
 * 라디오는 단독 사용이 금지돼 있다(디자인시스템 가이드). 항상 같은 name 을 공유하는
 * 2개 이상을 묶어서 쓴다.
 */
export function Radio({
  label,
  size = "md",
  checked,
  disabled,
  className,
  ...props
}: RadioProps) {
  const spec = sizeSpec[size];

  return (
    <label
      className={cn(
        "inline-flex w-fit items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />

      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-brand",
          spec.box,
          // 체크박스와 달리 선택돼도 배경은 그대로고 테두리만 브랜드로 바뀐다.
          disabled
            ? "bg-background-disabled border-border-strong"
            : checked
              ? "bg-background-default border-border-brand"
              : "bg-background-default border-border-strong",
        )}
      >
        {checked && (
          <span
            className={cn(
              "rounded-full",
              spec.dot,
              disabled ? "bg-text-on-disabled" : "bg-background-brand",
            )}
          />
        )}
      </span>

      <span
        className={cn(
          "text-body-md",
          disabled ? "text-text-on-disabled" : "text-text-default",
        )}
      >
        {label}
      </span>
    </label>
  );
}
