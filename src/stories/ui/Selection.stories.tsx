import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { Radio } from "@/components/ui/Radio";
import { Select, SelectItem } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";

const meta = {
  title: "UI/Selection",
  component: Chip,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label-lg text-text-muted">{title}</h3>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

/**
 * 선택(unselected/selected) x 상태(default/disabled) x 사이즈(sm/md).
 * 좌우 패딩이 좌측 아이콘 유무로 갈리는 게 이 컴포넌트의 핵심이다.
 */
export const Chips: Story = {
  args: { children: "한식" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {(["sm", "md"] as const).map((size) => (
        <Row key={size} title={`${size} · 아이콘 없음`}>
          <Chip size={size}>한식</Chip>
          <Chip size={size} selected>
            한식
          </Chip>
          <Chip size={size} disabled>
            한식
          </Chip>
          <Chip size={size} selected disabled>
            한식
          </Chip>
        </Row>
      ))}
      {(["sm", "md"] as const).map((size) => (
        <Row key={size} title={`${size} · 좌측 아이콘`}>
          <Chip size={size} icon="check">
            한식
          </Chip>
          <Chip size={size} icon="check" selected>
            한식 선택됨
          </Chip>
          <Chip size={size} icon="check" disabled>
            한식
          </Chip>
        </Row>
      ))}
    </div>
  ),
};

/** 상태 4종. focused 는 셀렉트를 클릭해 확인한다. */
export const Selects: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="지역 선택"
        placeholder="지역을 선택해주세요"
        defaultValue=""
        hint="현재 지역을 기준으로 추천해요"
      >
        <option value="guro">서울 · 구로구</option>
        <option value="oryu">서울 · 오류동</option>
      </Select>
      <Select label="지역 선택" defaultValue="oryu" hint="클릭하면 focused 가 된다">
        <option value="guro">서울 · 구로구</option>
        <option value="oryu">서울 · 오류동</option>
      </Select>
      <Select
        label="지역 선택"
        placeholder="지역을 선택해주세요"
        defaultValue=""
        hint="현재 지역을 기준으로 추천해요"
        disabled
      >
        <option value="guro">서울 · 구로구</option>
      </Select>
      <Select
        label="지역 선택"
        placeholder="지역을 선택해주세요"
        defaultValue=""
        error="지역을 선택해주세요"
      >
        <option value="guro">서울 · 구로구</option>
      </Select>
    </div>
  ),
};

/** sm(32) · md(40) · lg(48). 라운드는 세 사이즈 모두 8px 로 같다. */
export const SelectItems: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-6 p-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex max-w-[240px] flex-col gap-2">
          <h3 className="text-label-lg text-text-muted">{size}</h3>
          <SelectItem size={size} label="서울 · 구로구" />
          <SelectItem size={size} label="서울 · 오류동" selected />
          <SelectItem size={size} label="경기 · 부천시" disabled />
        </div>
      ))}
    </div>
  ),
};

/** 선택 3종(unchecked/checked/indeterminate) x 상태 3종(default/disabled/error). */
export const Checkboxes: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {(["sm", "md"] as const).map((size) => (
        <Row key={size} title={size}>
          <Checkbox size={size} label="선택 안 함" readOnly checked={false} />
          <Checkbox size={size} label="선택됨" readOnly checked />
          <Checkbox size={size} label="일부 선택" readOnly indeterminate />
          <Checkbox size={size} label="비활성" readOnly checked disabled />
          <Checkbox size={size} label="비활성 일부" readOnly indeterminate disabled />
          <Checkbox size={size} label="오류" readOnly checked tone="error" />
          <Checkbox size={size} label="오류 미선택" readOnly checked={false} tone="error" />
        </Row>
      ))}
    </div>
  ),
};

/** 라디오는 단독 사용이 금지돼 있어 항상 그룹으로 쓴다. */
export const Radios: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {(["sm", "md"] as const).map((size) => (
        <Row key={size} title={size}>
          <Radio
            size={size}
            name={`demo-${size}`}
            label="선택 가능한 옵션"
            readOnly
            checked={false}
          />
          <Radio size={size} name={`demo-${size}`} label="선택된 옵션" readOnly checked />
          <Radio size={size} name={`off-${size}`} label="비활성" readOnly disabled />
          <Radio
            size={size}
            name={`off2-${size}`}
            label="비활성 선택됨"
            readOnly
            checked
            disabled
          />
        </Row>
      ))}
    </div>
  ),
};

/** 단독 사용 전용. 트랙 폭은 sm 32 / md 40 이다. */
export const Switches: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {(["sm", "md"] as const).map((size) => (
        <Row key={size} title={size}>
          <Switch size={size} label="알림 꺼짐" readOnly checked={false} />
          <Switch size={size} label="알림 켜짐" readOnly checked />
          <Switch size={size} label="비활성 꺼짐" readOnly disabled />
          <Switch size={size} label="비활성 켜짐" readOnly checked disabled />
        </Row>
      ))}
    </div>
  ),
};
