import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * design.pen `TopNavigation/Base` 에 대응한다. 높이 56px, 하단 1px 구분선.
 *
 * 제목 정렬은 시안을 따른다. 좌측 슬롯이 있으면 제목이 가운데(상세·등록·마이페이지),
 * 없으면 좌측(메인)이다.
 */
export interface TopNavigationProps {
  title: string;
  /** 보통 뒤로가기 IconButton. */
  leading?: ReactNode;
  /** 보통 더보기 IconButton 이나 텍스트 액션. */
  trailing?: ReactNode;
  className?: string;
}

export function TopNavigation({
  title,
  leading,
  trailing,
  className,
}: TopNavigationProps) {
  return (
    <div
      className={cn(
        "bg-background-default border-border-default flex h-14 w-full items-center gap-1 border-b px-1",
        className,
      )}
    >
      {leading}
      <h1
        className={cn(
          "text-heading-sm text-text-default min-w-0 flex-1 truncate",
          leading ? "text-center" : "pl-3 text-left",
        )}
      >
        {title}
      </h1>
      {/* 좌측 버튼만 있고 우측이 비면 제목이 왼쪽으로 밀린다. 48px 자리를 남겨 균형을 맞춘다. */}
      {trailing ?? (leading ? <span aria-hidden className="size-12 shrink-0" /> : null)}
    </div>
  );
}
