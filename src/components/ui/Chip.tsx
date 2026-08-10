import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `Chip/<selection>/<state>/<size>` 8개에 대응한다. */
export type ChipSize = "sm" | "md";

/**
 * 좌우 패딩은 좌측 아이콘 유무로 갈린다.
 * sm: 아이콘 없음 12 / 있음 6, md: 아이콘 없음 16 / 있음 8.
 */
const sizeClass: Record<ChipSize, { base: string; withIcon: string; plain: string }> = {
  sm: { base: "h-6 gap-1", withIcon: "px-1.5", plain: "px-3" },
  md: { base: "h-8 gap-1.5", withIcon: "px-2", plain: "px-4" },
};

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  size?: ChipSize;
  selected?: boolean;
  /** 좌측 아이콘. 사이즈는 두 칩 모두 16px 고정이다. */
  icon?: IconName;
  children: React.ReactNode;
}

export function Chip({
  size = "md",
  selected = false,
  disabled = false,
  icon,
  className,
  children,
  type = "button",
  ...props
}: ChipProps) {
  const s = sizeClass[size];

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center rounded-full border whitespace-nowrap transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        s.base,
        icon ? s.withIcon : s.plain,
        // 테두리는 선택 상태를 따라가고, 배경과 글자만 disabled 로 덮인다.
        selected ? "border-border-brand" : "border-border-strong",
        disabled
          ? "bg-background-disabled text-text-on-disabled cursor-not-allowed"
          : selected
            ? "bg-background-brand text-text-on-brand cursor-pointer"
            : "bg-background-default text-text-default cursor-pointer",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={16} className="text-current" />}
      <span className="text-label-lg">{children}</span>
    </button>
  );
}
