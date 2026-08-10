import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  alphaColors,
  fontFamily,
  fontSizes,
  palettes,
  semanticColorGroups,
  spacing,
  typeScale,
} from "@/tokens/generated";

const meta = {
  title: "Foundation/Design Tokens",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primitiveCount =
  palettes.reduce((n, p) => n + p.tokens.length, 0) + alphaColors.length;
const semanticCount = semanticColorGroups.reduce(
  (n, g) => n + g.tokens.length,
  0,
);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-border-subtle py-2 last:border-b-0">
      <dt className="w-56 shrink-0 text-label-lg text-text-label">{label}</dt>
      <dd className="text-body-md text-text-default">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-heading-md text-text-default">{title}</h2>
      {children}
    </section>
  );
}

/**
 * 토큰 계층 전체 요약. 값의 출처는 design.pen 의 variables 이며
 * src/tokens/pencil-tokens.json 에 미러링되어 있다.
 */
export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-10 bg-background-default p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-sm text-text-default">Design Tokens</h1>
        <p className="text-body-lg text-text-secondary">
          모든 값은 <code className="text-label-lg">design.pen</code> 의 variables 에서
          가져왔습니다. 코드에서 hex 를 직접 쓰지 않고 시맨틱 토큰을 참조합니다.
        </p>
      </header>

      <Section title="구조">
        <dl className="flex flex-col">
          <Row
            label="프리미티브 컬러"
            value={`${primitiveCount}개 — 팔레트 ${palettes.length}종(각 50~950 11단계) + 알파 ${alphaColors.length}개`}
          />
          <Row
            label="시맨틱 컬러"
            value={`${semanticCount}개 — ${semanticColorGroups
              .map((g) => `${g.group} ${g.tokens.length}`)
              .join(" / ")}`}
          />
          <Row
            label="타이포그래피"
            value={`폰트 사이즈 ${fontSizes.length}단계 · 타입 스케일 ${typeScale.length}종 · ${fontFamily}`}
          />
          <Row
            label="스페이싱"
            value={spacing.map((s) => `${s.value}`).join(" / ") + " px"}
          />
        </dl>
      </Section>

      <Section title="사용 규칙">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-body-md text-text-secondary">
          <li>
            컴포넌트에서는 <strong className="text-text-default">시맨틱 토큰만</strong>{" "}
            사용합니다 (<code>bg-background-brand</code>,{" "}
            <code>text-text-on-brand</code>). 프리미티브(<code>brand-700</code>)는
            시맨틱 토큰을 정의할 때만 씁니다.
          </li>
          <li>
            타이포는 <code>text-body-md</code> 처럼 타입 스케일 유틸리티 하나로
            font-size · line-height · font-weight · letter-spacing 이 함께 적용됩니다.
          </li>
          <li>
            스페이싱 토큰은 <code>--ds-spacing-*</code> 로 노출됩니다. Tailwind 의{" "}
            <code>--spacing-*</code> 네임스페이스를 쓰면 디자인의 spacing-8(8px)과
            Tailwind 기본 <code>p-8</code>(32px)이 충돌하기 때문입니다.
          </li>
        </ul>
      </Section>

      <Section title="스페이싱">
        <div className="flex flex-col gap-2">
          {spacing.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <span className="w-32 shrink-0 text-label-lg text-text-label">
                {s.token}
              </span>
              <span className="w-12 shrink-0 text-body-md text-text-muted">
                {s.value}px
              </span>
              <div
                className="h-4 rounded-sm bg-background-brand"
                style={{ width: `${s.value * 4}px` }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="갱신 방법">
        <p className="text-body-md text-text-secondary">
          design.pen 의 variables 가 바뀌면{" "}
          <code className="text-label-lg">src/tokens/pencil-tokens.json</code> 을
          갱신하고 <code className="text-label-lg">npm run tokens</code> 를 실행합니다.{" "}
          <code>src/app/tokens.css</code> 와 <code>src/tokens/generated.ts</code> 가
          다시 생성됩니다.
        </p>
      </Section>
    </div>
  ),
};
