import { cn } from "@/lib/cn";

/**
 * design.pen `Skeleton/<Text|Rectangle|Circle>` 3개에 대응한다.
 * 색은 뉴트럴(`background-disabled`) 한 가지다.
 *
 * .pen 은 정지 상태만 담고 있지만 웹에서는 로딩 중임을 알리는 맥동이 기본 기대다.
 * `animate-pulse` 는 prefers-reduced-motion 에서 브라우저가 알아서 죽인다.
 */
const base = "bg-background-disabled animate-pulse";

/** 텍스트 여러 줄. 마지막 줄은 시안처럼 짧게 끝난다. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="불러오는 중"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={cn(
            base,
            "h-5 rounded",
            i === lines - 1 ? "w-[63%]" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

/** 카드 이미지처럼 면적을 차지하는 자리. 크기는 className 으로 준다. */
export function SkeletonRectangle({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="불러오는 중"
      className={cn(base, "block w-full rounded-xl", className)}
    />
  );
}

/** 아바타 자리. 지름은 className 으로 준다. */
export function SkeletonCircle({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="불러오는 중"
      className={cn(base, "block rounded-full", className ?? "size-16")}
    />
  );
}
