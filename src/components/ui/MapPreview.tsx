import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * 시안의 지도 영역 세 가지를 한 컴포넌트로 묶었다.
 *
 * - `image`: 실제 지도 캡처 이미지. 상세 위치 블록과 장소 선택 화면이 쓴다.
 * - `located`: 브랜드 틴트 배경 위에 녹지·도로 도형과 핀, 하단에 지역명.
 *   캡처 이미지가 없는 데이터의 폴백이다.
 * - `empty`: 등록 화면. 장소를 아직 고르지 않은 비활성 상태.
 *
 * 실제 지도 SDK 가 붙기 전까지 쓰는 자리표시자다. 도형은 전부 장식이라 aria 에서 감춘다.
 */
export interface MapPreviewProps {
  variant?: "located" | "empty" | "image";
  /** image 일 때 보여줄 지도 캡처. CardMedia 처럼 높이·라운드는 className 으로 정한다. */
  src?: string;
  /** image 일 때의 접근성 이름. */
  alt?: string;
  /** located 일 때 하단에 표시할 지역명. */
  caption?: string;
  /** empty 일 때 가운데에 표시할 안내 문구. */
  emptyText?: string;
  className?: string;
}

export function MapPreview({
  variant = "located",
  src,
  alt = "",
  caption,
  emptyText = "장소를 선택하면 위치가 표시돼요",
  className,
}: MapPreviewProps) {
  if (variant === "image") {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        style={{ backgroundImage: src ? `url(${src})` : undefined }}
        className={cn(
          // 폭을 고정하지 않아야 등록 화면의 음수 마진(full-bleed)이 성립한다.
          "bg-background-subtle bg-cover bg-center",
          className,
        )}
      />
    );
  }

  if (variant === "empty") {
    return (
      <div
        className={cn(
          "bg-background-subtle flex h-[146px] w-full flex-col items-center justify-center gap-2 rounded-2xl",
          className,
        )}
      >
        {/* 시안 실측 42px. */}
        <span className="bg-background-neutral-soft flex size-10.5 items-center justify-center rounded-full">
          <Icon name="image" size={24} className="text-icon-muted" />
        </span>
        <p className="text-label-md text-text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-background-map relative h-[190px] w-full overflow-hidden rounded-2xl",
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-background-map-accent absolute -top-4 -left-6 h-20 w-28 rounded-[30px]"
      />
      <span
        aria-hidden
        className="bg-background-map-accent absolute -right-4 bottom-2 h-17 w-19 rounded-[34px]"
      />
      <span
        aria-hidden
        className="bg-background-map-road absolute top-1/2 -left-8 h-4 w-[120%] -translate-y-1/2 rotate-[-4deg] rounded-lg"
      />
      <span
        aria-hidden
        className="bg-background-map-road absolute inset-y-2 left-[38%] w-3.5 rounded-[7px]"
      />
      <span
        aria-hidden
        className="bg-background-map-road absolute bottom-9 -left-4 h-2 w-[110%] rotate-[3deg] rounded-md"
      />

      <span className="bg-background-brand absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_4px_8px_0_var(--color-shadow-strong)]">
        <Icon name="home" size={24} className="text-icon-on-brand" />
      </span>

      {caption && (
        <p className="text-label-lg text-text-secondary absolute bottom-4 left-4">
          {caption}
        </p>
      )}
    </div>
  );
}
