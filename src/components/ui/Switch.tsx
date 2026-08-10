"use client";

import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/** design.pen `Switch/<state>/<disabled>/<size>` 8개에 대응한다. */
export type SwitchSize = "sm" | "md";

/**
 * 트랙 안쪽 여백은 2px 고정이라 노브 이동 거리는 트랙폭 - 노브폭 - 4 가 된다.
 * sm: 32 - 12 - 4 = 16, md: 40 - 16 - 4 = 20.
 */
const sizeSpec = {
  sm: { track: "h-4 w-8", knob: "size-3", on: "translate-x-4" },
  md: { track: "h-5 w-10", knob: "size-4", on: "translate-x-5" },
} as const;

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label: string;
  size?: SwitchSize;
}

export function Switch({
  label,
  size = "md",
  checked,
  disabled,
  className,
  ...props
}: SwitchProps) {
  const spec = sizeSpec[size];

  return (
    <label
      className={cn(
        "inline-flex w-fit items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />

      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center rounded-full p-0.5 transition-colors",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-brand",
          spec.track,
          disabled
            ? "bg-background-disabled"
            : checked
              ? "bg-background-brand"
              : "bg-background-inverse",
        )}
      >
        <span
          className={cn(
            "rounded-full transition-transform",
            spec.knob,
            checked ? spec.on : "translate-x-0",
            disabled ? "bg-text-on-disabled" : "bg-background-default",
          )}
        />
      </span>

      <span
        className={cn(
          "text-body-md",
          disabled ? "text-text-on-disabled" : "text-text-default",
        )}
      >
        {label}
      </span>
    </label>
  );
}
