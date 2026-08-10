"use client";

import { cn } from "@/lib/cn";

/**
 * design.pen `TabNavigation/Base` 에 대응한다.
 * 높이 48px, 아이템 균등 분배, 선택 항목 아래 2px 브랜드 인디케이터.
 */
export interface TabItem {
  id: string;
  label: string;
}

export interface TabNavigationProps {
  items: TabItem[];
  activeId: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function TabNavigation({
  items,
  activeId,
  onChange,
  className,
}: TabNavigationProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "bg-background-default border-border-default flex h-12 w-full items-stretch border-b",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(item.id)}
            className="focus-visible:outline-border-brand flex flex-1 cursor-pointer flex-col justify-between focus-visible:outline-2 focus-visible:-outline-offset-2"
          >
            <span
              className={cn(
                "text-label-lg flex flex-1 items-center justify-center",
                active ? "text-text-brand" : "text-text-secondary",
              )}
            >
              {item.label}
            </span>
            {/* 미선택도 2px 자리를 차지해야 레이블 높이가 흔들리지 않는다. */}
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-full",
                active ? "bg-background-brand" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
