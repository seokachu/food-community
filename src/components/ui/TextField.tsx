"use client";

import { useId, type InputHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `TextField/<type>/<state>/<size>` 24개에 대응한다. */
export type TextFieldSize = "sm" | "md" | "lg";

/** 높이 / 라운드 / 좌우 패딩. design.pen 실측값이다. */
const sizeClass: Record<TextFieldSize, string> = {
  sm: "h-8 rounded-[10px] px-2.5",
  md: "h-10 rounded-xl px-3",
  lg: "h-12 rounded-[14px] px-3.5",
};

const iconSize: Record<TextFieldSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 생략하면 레이블 행 자체가 사라진다. 메인 화면 검색 필드가 그 경우다. */
  label?: string;
  /** 힌트는 error 가 있으면 에러 메시지로 대체된다. */
  hint?: string;
  error?: string;
  fieldSize?: TextFieldSize;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export function TextField({
  label,
  hint,
  error,
  fieldSize = "md",
  leftIcon,
  rightIcon,
  disabled,
  className,
  id,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  const glyph = iconSize[fieldSize];

  // 에러일 때 우측 자리는 상태 아이콘이 가져간다. 명시된 rightIcon 이 있으면 그것을 존중한다.
  const trailingIcon: IconName | undefined =
    rightIcon ?? (error ? "error" : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
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
          "flex w-full items-center gap-2 border transition-colors",
          sizeClass[fieldSize],
          disabled
            ? "bg-background-disabled border-border-default"
            : "bg-background-default",
          // 포커스 링은 1px 테두리 위에 얹어 2px 처럼 보이게 한다.
          // 테두리 두께를 바꾸면 높이가 흔들려서 레이아웃이 튄다.
          !disabled && error && "border-border-error",
          !disabled &&
            !error &&
            "border-border-default focus-within:border-border-brand focus-within:ring-1 focus-within:ring-border-brand",
        )}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={glyph}
            className={disabled ? "text-icon-on-disabled" : "text-icon-muted"}
          />
        )}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "text-body-lg min-w-0 flex-1 bg-transparent outline-none",
            "placeholder:text-text-muted",
            disabled
              ? "text-text-on-disabled cursor-not-allowed"
              : "text-text-default",
          )}
          {...props}
        />

        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={glyph}
            className={
              error
                ? "text-icon-error"
                : disabled
                  ? "text-icon-on-disabled"
                  : "text-icon-muted"
            }
          />
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={cn(
            "text-label-md",
            error ? "text-text-error" : "text-text-muted",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
