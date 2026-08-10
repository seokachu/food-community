import type { ReactNode } from "react";

import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { HeaderNavigation } from "@/components/ui/HeaderNavigation";
import { cn } from "@/lib/cn";

/**
 * 화면 골격. 브레이크포인트마다 전역 내비게이션의 자리가 바뀐다.
 *
 * - 모바일(<768): 시안 그대로. 상단은 화면별 TopNavigation, 하단은 고정 바텀내비게이션.
 * - 태블릿·데스크톱(≥768): 바텀내비게이션을 감추고 상단 헤더 하나로 합친다.
 *   시안에 없는 확장이라 HeaderNavigation 컴포넌트에 규칙을 적어 두었다.
 *
 * 시안의 상태 표시줄(9:41 · 배터리)은 기기 크롬이라 웹으로 옮기지 않는다.
 */
export interface AppShellProps {
  /** 모바일에서만 보이는 화면별 상단 바. */
  topNavigation?: ReactNode;
  /** 로그인처럼 전역 내비게이션이 없어야 하는 화면은 false 로 끈다. */
  showNavigation?: boolean;
  className?: string;
  children: ReactNode;
}

export function AppShell({
  topNavigation,
  showNavigation = true,
  className,
  children,
}: AppShellProps) {
  return (
    <div className="bg-background-default flex min-h-dvh flex-col">
      {showNavigation && <HeaderNavigation className="hidden md:block" />}

      {topNavigation && (
        <div className="sticky top-0 z-20 md:hidden">{topNavigation}</div>
      )}

      <main
        className={cn(
          "flex flex-1 flex-col",
          // 고정 바텀내비게이션(56px)에 콘텐츠가 가리지 않도록 모바일에서만 자리를 비운다.
          showNavigation && "pb-14 md:pb-0",
          className,
        )}
      >
        {children}
      </main>

      {showNavigation && (
        <BottomNavigation className="fixed inset-x-0 bottom-0 z-20 md:hidden" />
      )}
    </div>
  );
}
