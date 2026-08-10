"use client";

import { useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/**
 * design.pen `Textarea/<state>` 4개에 대응한다.
 *
 * 입력 영역 높이는 3줄 고정(92px)이고, 넘치면 스크롤한다.
 * 헬퍼와 글자수 카운터는 같은 행에서 양끝 정렬된다.
 */
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
  label?: string;
  hint?: string;
  error?: string;
  /** 지정하면 하단 우측에 `현재 / 최대` 카운터가 붙는다. */
  maxLength?: number;
  /** 카운터에 쓸 현재 길이. 비제어로 쓸 때만 넘긴다. */
  currentLength?: number;
}

export function Textarea({
  label,
  hint,
  error,
  maxLength,
  currentLength,
  disabled,
  className,
  id,
  value,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const messageId = `${textareaId}-message`;
  const message = error ?? hint;

  const length =
    currentLength ?? (typeof value === "string" ? value.length : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            "text-label-lg",
            disabled ? "text-text-on-disabled" : "text-text-default",
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex h-23 w-full flex-col rounded-[14px] border p-3 transition-colors",
          disabled
            ? "bg-background-disabled border-border-default"
            : "bg-background-default",
          !disabled && error && "border-border-error",
          !disabled &&
            !error &&
            "border-border-default focus-within:border-border-brand focus-within:ring-1 focus-within:ring-border-brand",
        )}
      >
        <textarea
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "text-body-lg h-full w-full resize-none bg-transparent outline-none",
            "placeholder:text-text-muted",
            disabled
              ? "text-text-on-disabled cursor-not-allowed"
              : "text-text-default",
          )}
          {...props}
        />
      </div>

      {(message || maxLength) && (
        <div className="flex w-full items-center justify-between gap-2">
          <p
            id={messageId}
            className={cn(
              "text-label-md",
              error ? "text-text-error" : "text-text-muted",
            )}
          >
            {message}
          </p>
          {maxLength && (
            // 힌트는 disabled 에서도 muted 로 남지만 카운터만 on-disabled 로 내려간다.
            // design.pen `Textarea/Disabled` 가 그렇게 되어 있다.
            <span
              className={cn(
                "text-label-md shrink-0",
                disabled ? "text-text-on-disabled" : "text-text-muted",
              )}
            >
              {length ?? 0} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
