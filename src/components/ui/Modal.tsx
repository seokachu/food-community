"use client";

import { useEffect, type ReactNode } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * design.pen `Modal/Base` 에 대응한다.
 * 헤더(제목 + 닫기) / 바디 / 푸터(secondary + primary) + 배경 스크림 구조다.
 *
 * 포커스 트랩은 넣지 않았다. 시안이 정의하지 않은 동작이고, 라이브러리 없이 직접
 * 구현하면 어설프게 맞는 편이 더 위험하다. 스크림 클릭과 Esc 만 처리한다.
 */
export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** 푸터 버튼. 시안은 secondary 1개 + primary 1개다. */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Modal({
  open,
  title,
  onClose,
  footer,
  className,
  children,
}: ModalProps) {
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
      className="bg-background-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      // 스크림 자신이 눌렸을 때만 닫는다. 패널 안에서 시작한 클릭이나
      // 패널에서 스크림으로 빠져나간 드래그로는 닫히지 않는다.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "bg-background-default border-border-default flex w-full max-w-[420px] flex-col rounded-2xl border",
          className,
        )}
      >
        <header className="border-border-default flex items-center justify-between gap-4 border-b px-5 py-4.5">
          <h2 className="text-heading-sm text-text-default">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="focus-visible:outline-border-brand cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Icon name="close" size={16} className="text-icon-default" />
          </button>
        </header>

        <div className="text-body-md text-text-secondary p-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 pt-4 pb-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
