import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ICON_SIZES, Icon, iconNames } from "@/components/foundation/Icon";
import iconRegistry from "@/tokens/icon-registry.json";

const meta = {
  title: "Foundation/Iconography",
  component: Icon,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Icon>;

export default meta;
// StoryObj<typeof meta> 는 render 전용 문서 스토리에도 args 를 강제한다.
type Story = StoryObj<typeof Icon>;

const registry: Record<string, string> = iconRegistry;

/** design.pen 의 Icon 컴포넌트 144개(36종 × 4사이즈) + 코드에서 추가한 map-pin. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-background-default p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-sm text-text-default">Iconography</h1>
        <p className="text-body-lg text-text-secondary">
          Lucide 기반 {iconNames.length}종 × {ICON_SIZES.length}사이즈 ={" "}
          {iconNames.length * ICON_SIZES.length}개. 색은 currentColor 를 따르므로
          시맨틱 토큰 클래스로 제어합니다.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-border-default text-left">
              <th className="py-2 text-label-lg text-text-label">이름</th>
              {ICON_SIZES.map((s) => (
                <th
                  key={s}
                  className="w-16 py-2 text-center text-label-lg text-text-label"
                >
                  {s}
                </th>
              ))}
              <th className="py-2 text-label-lg text-text-label">lucide</th>
            </tr>
          </thead>
          <tbody>
            {iconNames.map((name) => (
              <tr key={name} className="border-b border-border-subtle">
                <td className="py-2 pr-4 text-body-md text-text-default">
                  {name}
                </td>
                {ICON_SIZES.map((size) => (
                  <td key={size} className="py-2">
                    <div className="flex justify-center">
                      <Icon name={name} size={size} />
                    </div>
                  </td>
                ))}
                <td className="py-2 pl-4 text-body-md text-text-muted">
                  {registry[name] === name ? "—" : registry[name]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};

/**
 * 시맨틱 이름과 lucide 이름이 다른 항목들. 디자인 파일의 이름만 보고
 * lucide 에서 같은 이름을 찾으면 다른 글리프가 나오거나 없는 경우가 있어 따로 정리한다.
 */
export const NameMapping: Story = {
  render: () => {
    const aliased = iconNames.filter((n) => registry[n] !== n);
    return (
      <div className="flex flex-col gap-4 bg-background-default p-8">
        <h1 className="text-display-sm text-text-default">Name Mapping</h1>
        <p className="text-body-lg text-text-secondary">
          {aliased.length}개 아이콘은 디자인 시스템 이름과 lucide 이름이 다릅니다.
          코드에서는 왼쪽(디자인 시스템 이름)을 씁니다.
        </p>
        <table className="w-full max-w-2xl border-collapse">
          <thead>
            <tr className="border-b border-border-default text-left">
              <th className="w-12 py-2" />
              <th className="py-2 text-label-lg text-text-label">
                디자인 시스템
              </th>
              <th className="py-2 text-label-lg text-text-label">lucide</th>
            </tr>
          </thead>
          <tbody>
            {aliased.map((name) => (
              <tr key={name} className="border-b border-border-subtle">
                <td className="py-2">
                  <Icon name={name} size={24} />
                </td>
                <td className="py-2 text-body-md text-text-default">{name}</td>
                <td className="py-2 text-body-md text-text-muted">
                  {registry[name]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** 시맨틱 컬러 토큰을 아이콘에 적용한 예시 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-background-default p-8">
      <h1 className="text-display-sm text-text-default">Icon Colors</h1>
      <div className="flex flex-wrap gap-6">
        {[
          ["text-icon-default", "info"],
          ["text-icon-secondary", "user"],
          ["text-icon-muted", "search"],
          ["text-icon-brand", "heart"],
          ["text-icon-warning", "warning"],
          ["text-icon-success", "check"],
          ["text-icon-info", "info"],
          ["text-icon-error", "error"],
        ].map(([cls, name]) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <Icon
              name={name as (typeof iconNames)[number]}
              size={32}
              className={cls}
            />
            <span className="text-label-md text-text-muted">
              {cls.replace("text-", "")}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-6 rounded-lg bg-background-inverse p-6">
        {[
          ["text-icon-on-inverse", "home"],
          ["text-icon-on-brand", "bookmark"],
        ].map(([cls, name]) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <Icon
              name={name as (typeof iconNames)[number]}
              size={32}
              className={cls}
            />
            <span className="text-label-md text-text-on-inverse-secondary">
              {cls.replace("text-", "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Icon 컴포넌트 플레이그라운드 */
export const Playground: Story = {
  args: {
    name: "heart",
    size: 32,
  },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: [...ICON_SIZES] },
  },
};
