import type { ElementType, ReactNode } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * design.pen `Card/Base` 에 대응한다.
 *
 * .pen 의 카드는 `카드 이미지 영역` + `카드 콘텐츠 영역(제목 · 설명)` 구조다.
 * 이미지 영역의 높이는 쓰이는 자리마다 달라서(대표 176 / 컴팩트 104) 카드가
 * 직접 정하지 않고 `CardMedia` 의 className 으로 호출측이 정한다.
 */
export interface CardProps {
  /** 카드 전체가 링크가 되어야 하면 Link 컴포넌트를 넘긴다. */
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}

export function Card({ as, className, children, ...props }: CardProps) {
  const Tag = as ?? "div";

  return (
    <Tag
      className={cn(
        "bg-background-default border-border-default flex flex-col overflow-hidden rounded-2xl border",
        as && "hover:border-border-brand focus-visible:outline-border-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export interface CardMediaProps {
  src?: string;
  alt?: string;
  /** 높이나 종횡비를 정하는 유틸리티. 예: `h-26 sm:h-auto sm:aspect-[16/9]` */
  className?: string;
}

/**
 * src 가 없으면 design.pen 의 플레이스홀더(회색 배경 + 32px 이미지 아이콘)를 그린다.
 *
 * next/image 대신 CSS 배경을 쓴다. 카드 폭이 브레이크포인트마다 달라지는
 * 유동 그리드라 고정 width/height 를 줄 수 없고, fill 을 쓰면 모든 카드에
 * relative 컨테이너가 하나씩 더 필요해진다.
 */
export function CardMedia({ src, alt = "", className }: CardMediaProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "bg-background-disabled flex w-full items-center justify-center",
          className,
        )}
      >
        <Icon name="image" size={32} className="text-icon-muted" />
      </div>
    );
  }

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ backgroundImage: `url(${src})` }}
      className={cn(
        "bg-background-disabled w-full bg-cover bg-center",
        className,
      )}
    />
  );
}

/**
 * 기본 패딩은 design.pen `Card/Base` 의 20px 이다.
 * 화면에서는 대표 카드가 16, 컴팩트 카드가 12 로 줄여 쓰므로 그때는 p-4 / p-3 을 넘긴다.
 */
export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2 p-5", className)}>{children}</div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn("text-heading-sm text-text-default", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-body-md text-text-secondary", className)}>
      {children}
    </p>
  );
}
