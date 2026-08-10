import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { HeaderNavigation } from "@/components/ui/HeaderNavigation";
import { IconButton } from "@/components/ui/IconButton";
import { TabNavigation } from "@/components/ui/TabNavigation";
import { TopNavigation } from "@/components/ui/TopNavigation";

const meta = {
  title: "UI/Navigation",
  component: TopNavigation,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopNavigation>;

export default meta;
type Story = StoryObj<typeof TopNavigation>;

/**
 * 높이 56px. 좌측 슬롯이 있으면 제목이 가운데, 없으면 좌측이다.
 * 시안의 네 가지 조합을 그대로 나열했다.
 */
export const Top: Story = {
  args: { title: "맛집 이야기" },
  render: () => (
    <div className="bg-background-subtle flex max-w-[420px] flex-col gap-4 p-4">
      <TopNavigation
        title="숨은맛집"
        trailing={<IconButton icon="more-horizontal" label="더보기" />}
      />
      <TopNavigation
        title="맛집 이야기"
        leading={<IconButton icon="arrow-left" label="뒤로가기" />}
        trailing={<IconButton icon="more-horizontal" label="더보기" />}
      />
      <TopNavigation
        title="맛집 등록"
        leading={<IconButton icon="arrow-left" label="뒤로가기" />}
        trailing={
          <button
            type="button"
            className="text-label-lg text-text-secondary cursor-pointer px-3"
          >
            임시저장
          </button>
        }
      />
      <TopNavigation
        title="마이 페이지"
        leading={<IconButton icon="arrow-left" label="뒤로가기" />}
      />
    </div>
  ),
};

/**
 * 높이 56px, 아이템 균등 분배. 선택 아이템만 브랜드 라운드 박스 + 밝은 아이콘이다.
 * 라우터 없이 렌더하려고 activeHref 를 직접 넘긴다.
 */
export const Bottom: Story = {
  args: { title: "" },
  render: () => (
    <div className="bg-background-subtle flex max-w-[420px] flex-col gap-4 p-4">
      <BottomNavigation activeHref="/" />
      <BottomNavigation activeHref="/my" />
    </div>
  ),
};

/**
 * 태블릿·데스크톱 전용 헤더. design.pen 에 대응 컴포넌트가 없는 확장분이다.
 * 활성 표시는 .pen `TabNavigation/Base` 와 같은 2px 브랜드 인디케이터를 쓴다.
 */
export const Header: Story = {
  args: { title: "" },
  render: () => (
    <div className="bg-background-subtle flex flex-col gap-4 pb-8">
      <HeaderNavigation activeHref="/" />
      <HeaderNavigation activeHref="/register" />
    </div>
  ),
};

/**
 * design.pen `TabNavigation/Base`. 높이 48px, 균등 분배, 선택 항목 아래 2px 인디케이터.
 * 미선택 인디케이터도 자리를 차지해 레이블 높이가 흔들리지 않는다.
 */
export const Tabs: Story = {
  args: { title: "" },
  render: function TabStory() {
    const [active, setActive] = useState("recommend");

    return (
      <div className="bg-background-default max-w-[420px] p-4">
        <TabNavigation
          items={[
            { id: "recommend", label: "추천" },
            { id: "recent", label: "최신" },
            { id: "saved", label: "저장" },
          ]}
          activeId={active}
          onChange={setActive}
        />
      </div>
    );
  },
};
