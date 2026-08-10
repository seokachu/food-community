import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/**
 * 로그인 화면의 `Google로 시작하기` 버튼.
 *
 * Button 컴포넌트의 variant 로 넣지 않았다. 디자인시스템이 정의한 버튼 타입은
 * primary · secondary · destructive 셋 뿐이고, 이 버튼은 그 어디에도 속하지 않는
 * 외곽선형 소셜 로그인 버튼이라 타입 목록을 늘리지 않고 별도 컴포넌트로 둔다.
 */
export interface SocialSignInButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  provider?: "google";
}

const providerLabel = { google: "Google로 시작하기" } as const;
const providerMark = { google: "G" } as const;

export function SocialSignInButton({
  provider = "google",
  className,
  type = "button",
  ...props
}: SocialSignInButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "bg-background-default border-border-default focus-visible:outline-border-brand hover:border-border-strong flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="text-text-default text-base font-bold">
        {providerMark[provider]}
      </span>
      <span className="text-label-lg text-text-default">
        {providerLabel[provider]}
      </span>
    </button>
  );
}
