"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

import { isNavItemActive, NAV_ITEMS, type NavItem } from "./navigation-items";

/**
 * design.pen `BottomNavigation/Base` 에 대응한다. 높이 56px, 상단 1px 구분선,
 * 아이템 균등 분배.
 *
 * 선택 아이템은 브랜드색 라운드 박스 위에 밝은 아이콘을 올리고 레이블도 브랜드색이 된다.
 * 미선택은 아웃라인 아이콘 + 뉴트럴 레이블이다.
 */
export interface BottomNavigationProps {
  items?: NavItem[];
  /** 스토리북처럼 라우터가 없는 환경에서 활성 항목을 직접 지정한다. */
  activeHref?: string;
  className?: string;
}

export function BottomNavigation({
  items = NAV_ITEMS,
  activeHref,
  className,
}: BottomNavigationProps) {
  // usePathname 은 스토리북에서도 안전하게 동작하지만, activeHref 가 오면 그것을 우선한다.
  const pathname = usePathname();
  const current = activeHref ?? pathname ?? "/";

  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        "bg-background-default border-border-default flex h-14 w-full items-stretch border-t",
        className,
      )}
    >
      {items.map((item) => {
        const active = isNavItemActive(item.href, current);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="focus-visible:outline-border-brand flex flex-1 flex-col items-center justify-center gap-0.5 focus-visible:outline-2 focus-visible:-outline-offset-2"
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-[7px]",
                active ? "bg-background-brand" : "bg-transparent",
              )}
            >
              <Icon
                name={item.icon}
                size={24}
                className={active ? "text-icon-on-brand" : "text-icon-secondary"}
              />
            </span>
            <span
              className={cn(
                "text-label-md",
                active ? "text-text-brand" : "text-text-secondary",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
