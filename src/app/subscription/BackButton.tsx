"use client";

import { useRouter } from "next/navigation";

import { IconButton } from "@/components/ui/IconButton";

/** 뒤로가기. 메인 구독 시트와 마이페이지 두 경로에서 진입하므로 history back 을 쓴다. */
export function BackButton() {
  const router = useRouter();

  return (
    <IconButton
      icon="arrow-left"
      label="뒤로가기"
      onClick={() => router.back()}
    />
  );
}
