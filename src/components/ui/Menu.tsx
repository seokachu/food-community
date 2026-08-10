import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/** design.pen `MenuItem/<tone>/<state>/<size>` 12개에 대응한다. 라운드는 세 사이즈 모두 8px. */
export type MenuItemTone = "default" | "destructive";
export type MenuItemSize = "sm" | "md" | "lg";

const sizeClass: Record<MenuItemSize, string> = {
  sm: "h-8 px-2.5",
  md: "h-10 px-3",
  lg: "h-12 px-3.5",
};

const iconSize: Record<MenuItemSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

export interface MenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  tone?: MenuItemTone;
  size?: MenuItemSize;
  icon?: IconName;
}

export function MenuItem({
  label,
  tone = "default",
  size = "md",
  icon,
  disabled,
  className,
  type = "button",
  ...props
}: MenuItemProps) {
  const isDestructive = tone === "destructive";

  return (
    <button
      type={type}
      role="menuitem"
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        sizeClass[size],
        // 테두리는 tone 을 따라가고 배경과 글자만 disabled 로 덮인다.
        isDestructive ? "border-border-error" : "border-border-default",
        disabled
          ? "bg-background-disabled text-text-on-disabled cursor-not-allowed"
          : isDestructive
            ? "bg-background-default text-text-error cursor-pointer"
            : "bg-background-default text-text-default cursor-pointer",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize[size]} className="text-current" />}
      <span className="text-body-lg">{label}</span>
    </button>
  );
}

/** design.pen `Menu/Base`. 아이템을 감싸는 패널이다. */
export function Menu({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div
      role="menu"
      className={cn(
        "bg-background-default border-border-strong flex w-full flex-col gap-1 rounded-xl border p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
