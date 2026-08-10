"use client";

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `Select/<state>/<size>` 12개에 대응한다. 박스 스펙은 TextField 와 같다. */
export type SelectSize = "sm" | "md" | "lg";

const sizeClass: Record<SelectSize, string> = {
  sm: "h-8 rounded-[10px] px-2.5",
  md: "h-10 rounded-xl px-3",
  lg: "h-12 rounded-[14px] px-3.5",
};

const iconSize: Record<SelectSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  fieldSize?: SelectSize;
  /** 값이 없을 때 보여줄 문구. 비활성 옵션으로 들어간다. */
  placeholder?: string;
  children: ReactNode;
}

export function Select({
  label,
  hint,
  error,
  fieldSize = "md",
  placeholder,
  disabled,
  className,
  id,
  value,
  defaultValue,
  children,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;
  const message = error ?? hint;
  const isEmpty = (value ?? defaultValue ?? "") === "";

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={selectId}
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
          "relative flex w-full items-center border transition-colors",
          sizeClass[fieldSize],
          disabled
            ? "bg-background-disabled border-border-default"
            : "bg-background-default",
          !disabled && error && "border-border-error",
          // focused 는 시안이 2px 브랜드 테두리다. 높이가 튀지 않게 링을 얹는다.
          !disabled &&
            !error &&
            "border-border-default focus-within:border-border-brand focus-within:ring-1 focus-within:ring-border-brand",
        )}
      >
        <select
          id={selectId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "text-body-lg w-full appearance-none bg-transparent outline-none",
            disabled
              ? "text-text-on-disabled cursor-not-allowed"
              : isEmpty
                ? "text-text-muted cursor-pointer"
                : "text-text-default cursor-pointer",
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        {/* 네이티브 화살표는 appearance-none 으로 지우고 DS 아이콘을 얹는다. */}
        <Icon
          name="chevron-down"
          size={iconSize[fieldSize]}
          className={cn(
            "pointer-events-none absolute",
            fieldSize === "sm" ? "right-2.5" : fieldSize === "md" ? "right-3" : "right-3.5",
            disabled ? "text-icon-on-disabled" : "text-icon-muted",
          )}
        />
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

/** design.pen `SelectItem/<state>/<size>` 9개에 대응한다. 라운드는 세 사이즈 모두 8px 이다. */
export type SelectItemSize = "sm" | "md" | "lg";

const itemSizeClass: Record<SelectItemSize, string> = {
  sm: "h-8 px-2.5",
  md: "h-10 px-3",
  lg: "h-12 px-3.5",
};

const itemIconSize: Record<SelectItemSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

export interface SelectItemProps {
  label: string;
  size?: SelectItemSize;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

/**
 * 바텀시트(모바일)나 셀렉트 아래 패널(데스크톱)에 놓이는 선택지 한 줄.
 * Select 의 네이티브 option 을 쓰지 않는 커스텀 패널에서 사용한다.
 */
export function SelectItem({
  label,
  size = "md",
  selected = false,
  disabled = false,
  onSelect,
  className,
}: SelectItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        itemSizeClass[size],
        disabled
          ? "bg-background-disabled border-border-default text-text-on-disabled cursor-not-allowed"
          : selected
            ? "bg-background-brand border-border-brand text-text-on-brand cursor-pointer"
            : "bg-background-default border-border-default text-text-default cursor-pointer",
        className,
      )}
    >
      <span className="text-body-lg">{label}</span>
      {selected && !disabled && (
        <Icon name="check" size={itemIconSize[size]} className="text-current" />
      )}
    </button>
  );
}
