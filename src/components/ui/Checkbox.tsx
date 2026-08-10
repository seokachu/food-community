"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `Checkbox/<selection>/<state>/<size>` 18개에 대응한다. */
export type CheckboxSize = "sm" | "md";
export type CheckboxTone = "default" | "error";

/** 박스 크기와 라운드, 체크 표시 크기, indeterminate 막대 폭. */
const sizeSpec = {
  sm: { box: "size-4 rounded", check: 12, bar: "w-2" },
  md: { box: "size-5 rounded-[5px]", check: 14, bar: "w-2.5" },
} as const;

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label: string;
  size?: CheckboxSize;
  tone?: CheckboxTone;
  /** 일부만 선택된 그룹 헤더에 쓴다. checked 보다 우선한다. */
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  size = "md",
  tone = "default",
  indeterminate = false,
  checked,
  disabled,
  className,
  ...props
}: CheckboxProps) {
  const spec = sizeSpec[size];
  const inputRef = useRef<HTMLInputElement>(null);

  // indeterminate 는 HTML 속성이 아니라 DOM 프로퍼티로만 설정된다.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const isError = tone === "error";
  const marked = indeterminate || checked;

  return (
    <label
      className={cn(
        "inline-flex w-fit items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-invalid={isError ? true : undefined}
        className="peer sr-only"
        {...props}
      />

      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center border",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-brand",
          spec.box,
          // 테두리: disabled 는 strong, error 는 error, 선택된 기본형은 brand.
          disabled
            ? "border-border-strong"
            : isError
              ? "border-border-error"
              : marked
                ? "border-border-brand"
                : "border-border-strong",
          disabled
            ? "bg-background-disabled"
            : isError && marked
              ? "bg-background-error"
              : marked
                ? "bg-background-brand"
                : "bg-background-default",
        )}
      >
        {indeterminate ? (
          <span
            className={cn(
              "h-0.5 rounded-[1px]",
              spec.bar,
              disabled ? "bg-text-on-disabled" : "bg-background-default",
            )}
          />
        ) : (
          checked && (
            <Icon
              name="check"
              size={spec.check}
              strokeWidth={2}
              className={
                disabled ? "text-icon-on-disabled" : "text-icon-on-brand"
              }
            />
          )
        )}
      </span>

      <span
        className={cn(
          "text-body-md",
          disabled
            ? "text-text-on-disabled"
            : isError
              ? "text-text-error"
              : "text-text-default",
        )}
      >
        {label}
      </span>
    </label>
  );
}
