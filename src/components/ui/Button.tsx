import type { ButtonHTMLAttributes, ElementType } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

import { Spinner } from "./Spinner";

/** design.pen `Button/<variant>/<state>/<size>` 27개 컴포넌트에 대응한다. */
export type ButtonVariant = "primary" | "secondary" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

/** 높이 / 라운드 / 좌우 패딩 / 아이콘 간격. 전부 design.pen 실측값이다. */
const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 rounded-[10px] px-3 gap-1.5",
  md: "h-10 rounded-xl px-4 gap-2",
  lg: "h-12 rounded-[14px] px-5 gap-2",
};

/** sm 만 16px, md·lg 는 20px 이다. */
const iconSize: Record<ButtonSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-background-brand text-text-on-brand",
  secondary: "bg-background-inverse text-text-on-inverse",
  destructive: "bg-background-error text-text-on-inverse",
};

/** disabled 는 세 variant 가 같은 회색으로 수렴한다. */
const disabledClass = "bg-background-disabled text-text-on-disabled";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** loading 중에는 좌측 아이콘이 스피너로 바뀌고 레이블은 유지된다. */
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** 폼 제출 버튼처럼 가로를 꽉 채워야 할 때 쓴다. */
  fullWidth?: boolean;
  /**
   * 화면 이동이 목적이면 next/link 를 넘긴다. a 안에 button 을 넣는 대신
   * 태그 자체를 바꾼다.
   */
  as?: ElementType;
  children: React.ReactNode;
  [key: string]: unknown;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  as,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isInert = disabled || loading;
  const Tag = as ?? "button";

  return (
    <Tag
      type={as ? undefined : type}
      disabled={as ? undefined : isInert}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        sizeClass[size],
        disabled ? disabledClass : variantClass[variant],
        fullWidth ? "w-full" : "w-fit",
        isInert ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner size={iconSize[size]} className="text-current" />
      ) : (
        leftIcon && <Icon name={leftIcon} size={iconSize[size]} className="text-current" />
      )}
      <span className="text-label-lg">{children}</span>
      {rightIcon && (
        <Icon name={rightIcon} size={iconSize[size]} className="text-current" />
      )}
    </Tag>
  );
}
