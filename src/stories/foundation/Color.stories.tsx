import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { contrastRatio, formatRatio, grade } from "@/lib/contrast";
import { alphaColors, palettes, semanticColorGroups } from "@/tokens/generated";

const meta = {
  title: "Foundation/Color",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 팔레트 대비 기준면. design.pen 의 color-background-default 가 참조하는 값이다. */
const SURFACE =
  palettes
    .find((p) => p.name === "neutral")!
    .tokens.find((t) => t.step === "50")!.value;

const PALETTE_LABEL: Record<string, string> = {
  brand: "브랜드",
  neutral: "뉴트럴",
  amber: "경고 (warning)",
  green: "성공 (success)",
  blue: "정보 (info)",
  red: "에러 (error)",
};

function Page({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 bg-background-default p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-sm text-text-default">{title}</h1>
        <p className="text-body-lg text-text-secondary">{description}</p>
      </header>
      {children}
    </div>
  );
}

/**
 * 프리미티브 팔레트. design.pen 의 "Color Foundation · Primitive Palettes" 프레임과
 * 동일하게 팔레트당 1행, 토큰당 정사각형 1개로 렌더한다.
 */
export const Primitives: Story = {
  render: () => (
    <Page
      title="Primitive Colors"
      description="6개 팔레트 × 11단계. 코드에서 직접 쓰지 않고 시맨틱 토큰의 재료로만 사용합니다."
    >
      <div className="flex flex-col gap-6">
        {palettes.map((palette) => (
          <section key={palette.name} className="flex flex-col gap-2">
            <h2 className="text-heading-sm text-text-default">
              {PALETTE_LABEL[palette.name] ?? palette.name}
              <span className="ml-2 text-label-md text-text-muted">
                color-{palette.name}-*
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {palette.tokens.map((t) => (
                <div key={t.token} className="flex w-16 flex-col gap-1">
                  <div
                    className="h-16 w-16 rounded-md border border-border-subtle"
                    style={{ background: t.value }}
                  />
                  <span className="text-label-md text-text-default">{t.step}</span>
                  <span className="text-[10px] leading-tight text-text-muted">
                    {t.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="flex flex-col gap-2">
          <h2 className="text-heading-sm text-text-default">
            알파
            <span className="ml-2 text-label-md text-text-muted">
              color-alpha-*
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {alphaColors.map((t) => (
              <div key={t.token} className="flex w-28 flex-col gap-1">
                <div
                  className="h-16 w-28 rounded-md border border-border-subtle"
                  style={{
                    // 알파 색을 첫 레이어로 올리고 체커보드를 그 아래에 깐다.
                    // 순서가 바뀌면 체커보드가 색을 덮어 투명도가 안 보인다.
                    backgroundImage: `linear-gradient(${t.value}, ${t.value}), repeating-conic-gradient(var(--color-neutral-300) 0% 25%, #ffffff 0% 50%)`,
                    backgroundSize: "auto, 12px 12px",
                  }}
                />
                <span className="text-[10px] leading-tight text-text-default">
                  {t.token.replace("color-alpha-", "")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Page>
  ),
};

/** 시맨틱 토큰. 각 항목이 어떤 프리미티브를 참조하는지 함께 표시한다. */
export const Semantic: Story = {
  render: () => (
    <Page
      title="Semantic Colors"
      description="컴포넌트가 실제로 참조하는 계층입니다. hex 대신 항상 이 토큰을 사용합니다."
    >
      <div className="flex flex-col gap-8">
        {semanticColorGroups.map((group) => (
          <section key={group.group} className="flex flex-col gap-2">
            <h2 className="text-heading-sm capitalize text-text-default">
              {group.group}
              <span className="ml-2 text-label-md text-text-muted">
                {group.tokens.length}개
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-border-default text-left">
                    <th className="w-16 py-2 text-label-lg text-text-label" />
                    <th className="py-2 text-label-lg text-text-label">토큰</th>
                    <th className="py-2 text-label-lg text-text-label">
                      참조 프리미티브
                    </th>
                    <th className="py-2 text-label-lg text-text-label">값</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((t) => (
                    <tr key={t.token} className="border-b border-border-subtle">
                      <td className="py-2">
                        <div
                          className="h-8 w-12 rounded-md border border-border-subtle"
                          style={{ background: t.value }}
                        />
                      </td>
                      <td className="py-2 pr-4 text-body-md text-text-default">
                        {t.token}
                      </td>
                      <td className="py-2 pr-4 text-body-md text-text-muted">
                        {t.ref}
                      </td>
                      <td className="py-2 text-body-md text-text-muted">
                        {t.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </Page>
  ),
};

/**
 * 컬러 가이드의 제약("각 팔레트에서 neutral-50 대비 3:1, 4.5:1 을 만족하는 단계가 있을 것")이
 * 실제로 지켜졌는지 검증하는 문서. 값이 바뀌면 이 표가 먼저 깨진다.
 */
export const Contrast: Story = {
  render: () => (
    <Page
      title="Contrast"
      description={`기준면 neutral-50 (${SURFACE}) 위에서의 WCAG 2.1 대비. 본문 텍스트는 4.5:1, 큰 텍스트·아이콘은 3:1 이상이어야 합니다.`}
    >
      <div className="flex flex-col gap-6">
        {palettes.map((palette) => {
          const rows = palette.tokens.map((t) => {
            const ratio = contrastRatio(t.value, SURFACE);
            return { ...t, ratio, g: grade(ratio) };
          });
          const firstAA = rows.find((r) => r.ratio >= 4.5);
          const firstLarge = rows.find((r) => r.ratio >= 3);

          return (
            <section key={palette.name} className="flex flex-col gap-2">
              <h2 className="text-heading-sm text-text-default">
                {PALETTE_LABEL[palette.name] ?? palette.name}
                <span className="ml-2 text-label-md text-text-muted">
                  3:1 부터 {firstLarge?.step ?? "없음"} · 4.5:1 부터{" "}
                  {firstAA?.step ?? "없음"}
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {rows.map((r) => (
                  <div
                    key={r.token}
                    className="flex w-24 flex-col items-center gap-1 rounded-md border border-border-subtle p-2"
                    style={{ background: SURFACE }}
                  >
                    <span
                      className="text-heading-md"
                      style={{ color: r.value }}
                    >
                      {r.step}
                    </span>
                    <span className="text-[10px] text-neutral-700">
                      {formatRatio(r.ratio)}
                    </span>
                    <span
                      className="rounded px-1 text-[10px]"
                      style={{
                        background:
                          r.g === "Fail"
                            ? "var(--color-background-error-subtle)"
                            : "var(--color-background-success-subtle)",
                        color:
                          r.g === "Fail"
                            ? "var(--color-text-error)"
                            : "var(--color-text-success)",
                      }}
                    >
                      {r.g}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Page>
  ),
};
