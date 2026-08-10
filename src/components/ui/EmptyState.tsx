import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * design.pen `Empty/Base` 에 대응한다.
 * 비주얼(브랜드 테두리 원 + 32px 아이콘) · 제목 · 설명 · 액션 순서이며 모두 가운데 정렬이다.
 */
export interface EmptyStateProps {
  /** 생략하면 비주얼 원이 빠진다. */
  icon?: IconName;
  title: string;
  description?: string;
  /** 보통 Button 1~2개. */
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 p-8 text-center",
        className,
      )}
    >
      {icon && (
        <span className="border-border-brand flex size-16 items-center justify-center rounded-full border">
          <Icon name={icon} size={32} className="text-icon-brand" />
        </span>
      )}
      <h3 className="text-heading-sm text-text-default">{title}</h3>
      {description && (
        <p className="text-body-md text-text-secondary">{description}</p>
      )}
      {actions && (
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
