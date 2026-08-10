import type { ElementType, ReactNode } from "react";

import type { TypeScaleName } from "@/tokens/generated";

/**
 * design.pen 의 `Typography/<variant>` 컴포넌트 10개에 대응한다.
 *
 * 클래스명은 반드시 리터럴이어야 한다. `text-${variant}` 로 조합하면
 * Tailwind 가 소스 스캔에서 찾지 못해 유틸리티가 생성되지 않는다.
 * 각 유틸리티 하나가 font-size / line-height / font-weight / letter-spacing 을 모두 적용한다.
 */
const variantClass: Record<TypeScaleName, string> = {
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "display-sm": "text-display-sm",
  "heading-lg": "text-heading-lg",
  "heading-md": "text-heading-md",
  "heading-sm": "text-heading-sm",
  "body-lg": "text-body-lg",
  "body-md": "text-body-md",
  "label-lg": "text-label-lg",
  "label-md": "text-label-md",
};

/** variant 를 그대로 썼을 때 의미가 통하는 기본 태그 */
const defaultTag: Record<TypeScaleName, ElementType> = {
  "display-lg": "h1",
  "display-md": "h2",
  "display-sm": "h3",
  "heading-lg": "h3",
  "heading-md": "h4",
  "heading-sm": "h5",
  "body-lg": "p",
  "body-md": "p",
  "label-lg": "span",
  "label-md": "span",
};

export interface TextProps {
  variant: TypeScaleName;
  /** 문서 구조에 맞게 태그를 덮어쓴다. 시각적 크기와 헤딩 레벨은 별개다. */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

export function Text({ variant, as, className, children }: TextProps) {
  const Tag = as ?? defaultTag[variant];

  return (
    <Tag className={[variantClass[variant], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
