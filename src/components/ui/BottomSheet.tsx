"use client";

import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * design.pen `BottomSheet/Base` 에 대응한다.
 * 상단 드래그 핸들 + 중앙 콘텐츠 + 배경 스크림. 스크림을 누르면 선택 없이 닫힌다.
 *
 * 드래그 제스처는 넣지 않았다. 시안의 핸들은 "끌어내릴 수 있다"는 시각 신호이고,
 * 실제 제스처는 .pen 이 정의하지 않는다.
 */
export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** 스크린리더가 읽을 시트 이름. */
  label: string;
  className?: string;
  children: ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  label,
  className,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="bg-background-overlay fixed inset-0 z-50 flex flex-col justify-end"
      // 스크림 자신이 눌렸을 때만 닫는다. 패널 안에서 시작한 클릭이나
      // 패널에서 스크림으로 빠져나간 드래그로는 닫히지 않는다.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "bg-background-default flex w-full flex-col items-center rounded-t-[20px]",
          className,
        )}
      >
        <div className="flex h-7 w-full items-center justify-center">
          <span
            aria-hidden
            className="bg-border-strong h-1 w-10 rounded-full"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-6 pt-3 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
