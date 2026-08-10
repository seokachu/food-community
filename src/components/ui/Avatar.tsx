import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

/**
 * 시안에 나오는 두 가지 아바타에 대응한다.
 * 상세 화면 작성자(28px · 뉴트럴)와 마이페이지 프로필(88px · 브랜드 소프트)이다.
 */
export type AvatarSize = 28 | 88;
export type AvatarTone = "neutral" | "brand";

const sizeClass: Record<AvatarSize, string> = { 28: "size-7", 88: "size-22" };
const glyphSize: Record<AvatarSize, 16 | 40> = { 28: 16, 88: 40 };

const toneClass: Record<AvatarTone, string> = {
  neutral: "bg-background-neutral-soft text-icon-secondary",
  brand: "bg-background-brand-soft text-icon-brand",
};

export interface AvatarProps {
  size?: AvatarSize;
  tone?: AvatarTone;
  /** 사진이 있으면 배경 이미지로 채우고 아이콘은 감춘다. */
  src?: string;
  /** 사진일 때만 의미가 있다. 기본 아이콘 상태는 장식으로 취급한다. */
  alt?: string;
  className?: string;
}

export function Avatar({
  size = 28,
  tone = "neutral",
  src,
  alt,
  className,
}: AvatarProps) {
  return (
    <span
      role={src && alt ? "img" : undefined}
      aria-label={src && alt ? alt : undefined}
      aria-hidden={src && alt ? undefined : true}
      style={src ? { backgroundImage: `url(${src})` } : undefined}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cover bg-center",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      {!src && (
        <Icon name="user" size={glyphSize[size]} className="text-current" />
      )}
    </span>
  );
}
