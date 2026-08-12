"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
// 디자인 시스템 Icon 레지스트리 36종은 design.pen 대응이라 iOS 시스템 아이콘(공유,
// 홈 화면에 추가)이 없다. 설치 가이드 전용 글리프라 레지스트리를 늘리지 않고
// lucide 에서 직접 가져온다.
import { Share, SquarePlus } from "lucide-react";

import { Icon } from "@/components/foundation/Icon";
import { Text } from "@/components/foundation/Text";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Chromium 계열이 쏘는 비표준 이벤트. lib.dom 타입에 없어서 직접 선언한다. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_AT_KEY = "pwa-install-banner-dismissed-at";
const DISMISS_FOR_DAYS = 7;

export type PwaInstallMode = "android" | "ios";

/** 이미 설치되어 standalone 으로 떠 있으면 배너를 낼 이유가 없다. */
function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPadOS 13+ 는 UA 가 macOS 로 위장하므로 터치 지점 수로 함께 판별한다. */
function isIosDevice() {
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isDismissedRecently() {
  const raw = window.localStorage.getItem(DISMISSED_AT_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return (
    Number.isFinite(dismissedAt) &&
    Date.now() - dismissedAt < DISMISS_FOR_DAYS * 24 * 60 * 60 * 1000
  );
}

/** 서버 렌더에서는 false, 하이드레이션이 끝난 클라이언트에서만 true. */
const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * 하단 앱 설치 유도 띠배너.
 *
 * - Android(Chromium): `beforeinstallprompt` 를 가로채 두었다가 배너 클릭 시
 *   네이티브 설치 프롬프트를 바로 연다.
 * - iOS: 프로그래매틱 설치가 불가능하므로 클릭 시 바텀시트로 수동 설치
 *   가이드를 안내한다.
 * - 이미 standalone 이거나 최근 7일 안에 닫았으면 아예 렌더하지 않는다.
 */
export function PwaInstallBanner({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    // 설치 가능해지면 크롬이 쏘는 이벤트. 기본 미니 인포바 대신 띠배너로 유도한다.
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // 배너 노출 여부는 상태가 아니라 파생값이다. 서버 렌더에서는 항상 null.
  let mode: PwaInstallMode | null = null;
  if (hydrated && !dismissed && !isStandaloneDisplay() && !isDismissedRecently()) {
    if (isIosDevice()) mode = "ios";
    else if (installEvent) mode = "android";
  }

  if (!mode) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (mode === "ios") {
      setGuideOpen(true);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    // 네이티브 프롬프트는 이벤트당 한 번만 열 수 있다.
    setInstallEvent(null);
    if (outcome !== "accepted") dismiss(); // 방금 거절했으면 당분간 다시 조르지 않는다
  };

  return (
    <>
      <PwaInstallBannerView
        mode={mode}
        onInstall={handleInstall}
        onDismiss={dismiss}
        className={className}
      />
      <IosInstallGuideSheet
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </>
  );
}

export interface PwaInstallBannerViewProps {
  mode: PwaInstallMode;
  onInstall: () => void;
  onDismiss: () => void;
  /** 바텀내비게이션 위에 얹을 때 `bottom-14 md:bottom-0` 처럼 위치를 덮어쓴다. */
  className?: string;
}

/**
 * 띠배너의 표시 전용 부분. 스토리북에서 브라우저 이벤트 없이 렌더하기 위해 분리했다.
 * 설치 유도라는 일회성 UI 라 기존 컴포넌트를 재사용하지 않고 마크업을 직접 작성한다.
 */
export function PwaInstallBannerView({
  mode,
  onInstall,
  onDismiss,
  className,
}: PwaInstallBannerViewProps) {
  return (
    <div
      role="region"
      aria-label="앱 설치 안내"
      className={cn(
        "border-border-default bg-background-default fixed inset-x-0 bottom-0 z-30 border-t shadow-[0_-4px_16px_rgba(11,15,16,0.08)]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-4 py-2.5 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={onInstall}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
        >
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={40}
            height={40}
            className="shrink-0"
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-label-lg text-text-default">
              숨은맛집 앱 설치
            </span>
            <span className="text-label-md text-text-muted truncate">
              홈 화면에 추가하면 앱처럼 바로 열 수 있어요
            </span>
          </span>
          <span
            aria-hidden
            className="bg-background-brand text-text-on-brand text-label-md ml-1 shrink-0 rounded-[10px] px-3 py-2"
          >
            {mode === "android" ? "설치" : "설치 방법"}
          </span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="설치 배너 닫기"
          className="text-icon-muted -mr-2 shrink-0 cursor-pointer rounded-lg p-2"
        >
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const GUIDE_STEPS = [
  {
    text: (
      <>
        Safari 하단 도구 막대에서{" "}
        <strong className="font-semibold">공유</strong> 버튼을 누르세요
      </>
    ),
    glyph: <Share className="text-icon-default size-5 shrink-0" aria-hidden />,
  },
  {
    text: (
      <>
        목록에서{" "}
        <strong className="font-semibold">‘홈 화면에 추가’</strong>를
        선택하세요
      </>
    ),
    glyph: (
      <SquarePlus className="text-icon-default size-5 shrink-0" aria-hidden />
    ),
  },
  {
    text: (
      <>
        오른쪽 위 <strong className="font-semibold">추가</strong>를 누르면
        홈 화면에 아이콘이 생겨요
      </>
    ),
    glyph: <Icon name="check" size={20} className="text-icon-default shrink-0" />,
  },
] as const;

/** iOS 는 설치 API 가 없어 수동 절차를 바텀시트로 안내한다. */
export function IosInstallGuideSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} label="iOS 홈 화면 설치 가이드">
      <Text variant="heading-md" as="h2" className="text-text-default pt-1">
        홈 화면에 추가하기
      </Text>
      <Text variant="body-md" className="text-text-muted pb-2 text-center">
        iPhone·iPad 의 Safari 에서 아래 순서대로 진행하면 앱처럼 설치돼요.
      </Text>
      <ol className="flex w-full flex-col gap-2 pb-4">
        {GUIDE_STEPS.map((step, index) => (
          <li
            key={index}
            className="border-border-default flex w-full items-center gap-3 rounded-xl border px-4 py-3"
          >
            <span className="bg-background-brand-subtle text-text-brand text-label-md flex size-6 shrink-0 items-center justify-center rounded-full">
              {index + 1}
            </span>
            <Text variant="body-md" as="span" className="text-text-default flex-1">
              {step.text}
            </Text>
            {step.glyph}
          </li>
        ))}
      </ol>
      <Button fullWidth onClick={onClose}>
        확인
      </Button>
    </BottomSheet>
  );
}
