import { cn } from "@/lib/cn";

/**
 * design.pen 의 `Spinner/md` (24px, 브랜드 컬러) 에 대응한다.
 *
 * .pen 에서는 정지된 아이콘 한 장이지만 웹에서는 회전이 본체다.
 * 색은 currentColor 를 따르므로 버튼 안에서는 버튼 레이블색을 그대로 물려받는다.
 */
export interface SpinnerProps {
  /** 지름(px). design.pen 이 정의한 사이즈는 md(24) 하나다. */
  size?: number;
  className?: string;
  /** 스피너가 화면에서 유일한 로딩 신호일 때만 지정한다. */
  label?: string;
}

export function Spinner({ size = 24, className, label }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin shrink-0", className ?? "text-icon-brand")}
      aria-hidden={label ? undefined : true}
      role={label ? "status" : undefined}
      aria-label={label}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
