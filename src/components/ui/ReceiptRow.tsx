import { cn } from "@/lib/cn";

/**
 * design.pen 결제 영수증·결제 요약의 `레이블 — 값` 한 줄.
 * 결제 완료 영수증과 마이페이지 결제·취소 카드가 같이 쓴다.
 */
export interface ReceiptRowProps {
  label: string;
  value: string;
  /** 플랜·결제 금액처럼 시안이 label-lg 로 굵게 강조하는 행. */
  strong?: boolean;
  className?: string;
}

export function ReceiptRow({
  label,
  value,
  strong = false,
  className,
}: ReceiptRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <span className="text-label-md text-text-muted">{label}</span>
      <span
        className={cn(
          "text-text-default text-right",
          strong ? "text-label-lg" : "text-label-md",
        )}
      >
        {value}
      </span>
    </div>
  );
}
