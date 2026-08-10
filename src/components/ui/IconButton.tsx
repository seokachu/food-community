import type { ButtonHTMLAttributes, ElementType } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `IconButton/<variant>/48` 3종에 대응한다. */
export type IconButtonVariant = "ghost" | "circleBrand" | "circleNeutral";

/**
 * design.pen 이 정의한 사이즈는 48 뿐이지만, 화면에서 텍스트 옆에 붙는
 * 인라인 편집 버튼(마이페이지 닉네임)은 32 로 쓰인다. 두 가지만 허용한다.
 */
export type IconButtonSize = 32 | 48;

const variantClass: Record<IconButtonVariant, string> = {
  ghost: "text-icon-default hover:bg-background-subtle",
  circleBrand: "bg-background-brand text-icon-on-brand",
  circleNeutral: "bg-background-neutral-soft text-icon-default",
};

const sizeClass: Record<IconButtonSize, string> = {
  32: "size-8",
  48: "size-12",
};

/** 48 안에는 24, 32 안에는 20 짜리 아이콘이 들어간다. */
const glyphSize: Record<IconButtonSize, 20 | 24> = { 32: 20, 48: 24 };

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: IconName;
  /** 아이콘 단독 버튼이므로 접근성 이름은 필수다. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /**
   * 화면 이동이 목적이면 next/link 를 넘긴다. a 안에 button 을 넣는 대신
   * 태그 자체를 바꾼다.
   */
  as?: ElementType;
  [key: string]: unknown;
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = 48,
  as,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  const Tag = as ?? "button";

  return (
    <Tag
      type={as ? undefined : type}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={glyphSize[size]} className="text-current" />
    </Tag>
  );
}
