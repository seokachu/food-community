import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * design.pen 로그인 화면의 `숨은맛집 브랜드 마크` 를 컴포넌트로 뽑았다.
 * 시안은 64px 한 가지지만 헤더에서는 더 작게 써야 해서 세 사이즈를 허용한다.
 * 라운드 값은 시안 비율(24/64)을 유지한다.
 */
export type BrandMarkSize = 32 | 40 | 64;

const sizeClass: Record<BrandMarkSize, string> = {
  32: "size-8 rounded-xl",
  40: "size-10 rounded-[15px]",
  64: "size-16 rounded-3xl",
};

const glyphSize: Record<BrandMarkSize, 16 | 20 | 32> = {
  32: 16,
  40: 20,
  64: 32,
};

export function BrandMark({
  size = 64,
  className,
}: {
  size?: BrandMarkSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-background-brand flex shrink-0 items-center justify-center",
        sizeClass[size],
        className,
      )}
    >
      <Icon name="heart" size={glyphSize[size]} className="text-icon-on-brand" />
    </span>
  );
}
