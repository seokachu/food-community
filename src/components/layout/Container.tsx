import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * 콘텐츠 폭 규칙을 한 곳에 모은다.
 *
 * 시안은 모바일(360px) 뿐이라 확장 규칙은 코드에서 정한다.
 * 최대 1280px 까지 늘어나고 그 이상은 좌우 여백으로 흘린다.
 * 좌우 거터는 시안의 16px 에서 시작해 화면이 넓어지면 24 → 32px 로 벌어진다.
 */
export const CONTAINER_MAX_WIDTH = "max-w-[1280px]";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        CONTAINER_MAX_WIDTH,
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * 폼이나 로그인처럼 카드 그리드가 아닌 화면이 쓰는 좁은 단일 컬럼.
 * 1280 안에서 다시 한 번 가운데로 모은다.
 */
export const NARROW_COLUMN_MAX_WIDTH = "max-w-[640px]";

export function NarrowColumn({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full", NARROW_COLUMN_MAX_WIDTH, className)}>
      {children}
    </div>
  );
}
