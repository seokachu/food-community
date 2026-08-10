import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "@/components/foundation/Text";
import { fontFamily, fontSizes, typeScale } from "@/tokens/generated";

/** design.pen 의 Typography 컴포넌트에 들어있는 샘플 문구를 그대로 쓴다. */
const SAMPLE: Record<string, string> = {
  "display-lg": "발견의 기쁨",
  "display-md": "숨은 맛집의 발견",
  "display-sm": "우리 동네의 새로운 맛",
  "heading-lg": "오래 기억되는 한 끼",
  "heading-md": "이웃이 먼저 알아본 맛집",
  "heading-sm": "오늘의 숨은 맛집 이야기",
  "body-lg": "동네 곳곳의 진짜 맛을 발견하고 기록합니다.",
  "body-md": "솔직한 경험을 나누고 새로운 단골집을 만나보세요.",
  "label-lg": "맛집 상세 보기",
  "label-md": "최근 업데이트",
};

const meta = {
  title: "Foundation/Typography",
  component: Text,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Text>;

export default meta;
// StoryObj<typeof meta> 는 render 전용 문서 스토리에도 args 를 강제한다.
type Story = StoryObj<typeof Text>;

/** 타입 스케일 10종. 각 행은 렌더 결과와 참조 토큰을 함께 보여준다. */
export const TypeScale: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background-default p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-sm text-text-default">Typography</h1>
        <p className="text-body-lg text-text-secondary">
          {fontFamily} · 공통 자간 -2%. 타입 스케일 유틸리티 하나가 font-size,
          line-height, font-weight, letter-spacing 을 모두 적용합니다.
        </p>
      </header>

      <div className="flex flex-col">
        {typeScale.map((t) => (
          <div
            key={t.name}
            className="flex flex-col gap-2 border-b border-border-subtle py-5 last:border-b-0 md:flex-row md:items-baseline md:gap-8"
          >
            <div className="flex w-64 shrink-0 flex-col gap-1">
              <span className="text-label-lg text-text-default">{t.name}</span>
              <span className="text-label-md text-text-muted">
                {t.refs.fontSize} · {t.refs.fontWeight} · {t.refs.lineHeight}
              </span>
              <span className="text-label-md text-text-muted">
                {t.fontSize}px / {t.fontWeight} / {t.lineHeight} / -2%
              </span>
            </div>
            <Text variant={t.name} as="p" className="text-text-default">
              {SAMPLE[t.name]}
            </Text>
          </div>
        ))}
      </div>
    </div>
  ),
};

/** 프리미티브 폰트 사이즈. 타입 스케일이 참조하는 재료층이다. */
export const FontSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-background-default p-8">
      <h1 className="text-display-sm text-text-default">Font Sizes</h1>
      <p className="text-body-md text-text-secondary">
        font-size-900(40px)은 토큰으로 정의되어 있으나 현재 타입 스케일에서는
        사용되지 않습니다.
      </p>
      <div className="flex flex-col">
        {fontSizes.map((f) => {
          const used = typeScale.some((t) => t.refs.fontSize === f.token);
          return (
            <div
              key={f.token}
              className="flex items-baseline gap-6 border-b border-border-subtle py-3 last:border-b-0"
            >
              <span className="w-36 shrink-0 text-label-lg text-text-label">
                {f.token}
              </span>
              <span className="w-14 shrink-0 text-body-md text-text-muted">
                {f.value}px
              </span>
              <span
                className="text-text-default"
                style={{ fontSize: `${f.value}px`, lineHeight: 1.2 }}
              >
                숨은맛집
              </span>
              {!used && (
                <span className="text-label-md text-text-muted">미사용</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ),
};

/** Text 컴포넌트 플레이그라운드 */
export const Playground: Story = {
  args: {
    variant: "heading-lg",
    children: "오래 기억되는 한 끼",
  },
  argTypes: {
    variant: {
      control: "select",
      options: typeScale.map((t) => t.name),
    },
    as: { control: false },
  },
};
