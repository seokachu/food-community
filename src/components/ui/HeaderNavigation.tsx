"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

import { BrandMark } from "./BrandMark";
import { isNavItemActive, NAV_ITEMS, type NavItem } from "./navigation-items";

/**
 * 태블릿·데스크톱 전용 전역 헤더.
 *
 * design.pen 에는 모바일 시안만 있어서 대응하는 .pen 컴포넌트가 없다. 대신
 * 바텀내비게이션과 같은 항목·아이콘을 쓰고, 활성 표시는 .pen `TabNavigation/Base`
 * 의 규칙(2px 브랜드 인디케이터)을 그대로 가져왔다. 새 색을 만들지 않는다.
 */
export interface HeaderNavigationProps {
  items?: NavItem[];
  /** 스토리북처럼 라우터가 없는 환경에서 활성 항목을 직접 지정한다. */
  activeHref?: string;
  className?: string;
}

export function HeaderNavigation({
  items = NAV_ITEMS,
  activeHref,
  className,
}: HeaderNavigationProps) {
  const pathname = usePathname();
  const current = activeHref ?? pathname ?? "/";

  return (
    <header
      className={cn(
        "bg-background-default border-border-default sticky top-0 z-30 w-full border-b",
        className,
      )}
    >
      {/* 폭 규칙은 Container 한 곳에만 둔다. 여기서 1280 을 다시 적지 않는다. */}
      <Container className="flex h-16 items-stretch gap-6">
        <Link
          href="/"
          className="focus-visible:outline-border-brand flex shrink-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <BrandMark size={32} />
          <span className="text-heading-sm text-text-default">숨은맛집</span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-stretch gap-1">
          {items.map((item) => {
            const active = isNavItemActive(item.href, current);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:outline-border-brand relative flex items-center gap-2 px-3 focus-visible:outline-2 focus-visible:-outline-offset-2",
                  active
                    ? "text-text-brand"
                    : "text-text-secondary hover:text-text-default",
                )}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className="text-current"
                />
                <span className="text-label-lg">{item.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="bg-background-brand absolute inset-x-0 bottom-0 h-0.5"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 로그인 화면은 시안상 탭바에 없다. 데스크톱에서만 헤더 끝에 진입점을 둔다. */}
        <Link
          href="/login"
          className="text-label-lg text-text-secondary hover:text-text-default focus-visible:outline-border-brand ml-auto flex shrink-0 items-center focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
          로그인
        </Link>
      </Container>
    </header>
  );
}
