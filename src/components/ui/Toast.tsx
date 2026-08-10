import { Icon, type IconName } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

import { IconButton } from "./IconButton";

/** design.pen `Toast/<tone>` 4종에 대응한다. */
export type ToastTone = "success" | "error" | "info" | "warning";

/** 배경은 네 톤 모두 inverse 고 테두리와 상태 아이콘 색만 다르다. */
const toneClass: Record<ToastTone, string> = {
  success: "border-border-success",
  error: "border-border-error",
  info: "border-border-info",
  warning: "border-border-warning",
};

const toneIcon: Record<ToastTone, IconName> = {
  success: "check",
  error: "error",
  info: "info",
  warning: "warning",
};

const toneIconClass: Record<ToastTone, string> = {
  success: "text-icon-success",
  error: "text-icon-error",
  info: "text-icon-info",
  warning: "text-icon-warning",
};

export interface ToastProps {
  tone?: ToastTone;
  message: string;
  /** 넘기면 우측에 닫기 버튼이 붙는다. */
  onClose?: () => void;
  className?: string;
}

export function Toast({
  tone = "info",
  message,
  onClose,
  className,
}: ToastProps) {
  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "bg-background-inverse flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-2",
        toneClass[tone],
        className,
      )}
    >
      <Icon
        name={toneIcon[tone]}
        size={20}
        className={cn("shrink-0", toneIconClass[tone])}
      />
      <p className="text-body-md text-text-on-inverse flex-1">{message}</p>
      {onClose && (
        <IconButton
          icon="close"
          label="알림 닫기"
          size={32}
          onClick={onClose}
          className="text-icon-on-inverse hover:bg-transparent"
        />
      )}
    </div>
  );
}
