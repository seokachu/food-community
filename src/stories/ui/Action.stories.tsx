import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";
import { IconButton, type IconButtonVariant } from "@/components/ui/IconButton";
import { SocialSignInButton } from "@/components/ui/SocialSignInButton";

const meta = {
  title: "UI/Action",
  component: Button,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "destructive"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const LABELS: Record<ButtonVariant, string> = {
  primary: "등록하기",
  secondary: "둘러보기",
  destructive: "삭제하기",
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label-lg text-text-muted">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** 타입(행) x 상태(열). design.pen 의 버튼 매트릭스와 같은 배치다. */
export const Buttons: Story = {
  args: { children: "등록하기" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {VARIANTS.map((variant) => (
        <Row key={variant} title={variant}>
          <Button variant={variant} leftIcon="plus">
            {LABELS[variant]}
          </Button>
          <Button variant={variant} leftIcon="plus" disabled>
            {LABELS[variant]}
          </Button>
          <Button variant={variant} leftIcon="plus" loading>
            {LABELS[variant]}
          </Button>
        </Row>
      ))}
    </div>
  ),
};

/** sm(32) · md(40) · lg(48). 아이콘은 sm 만 16px 이고 나머지는 20px 이다. */
export const ButtonSizes: Story = {
  args: { children: "등록하기" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      {SIZES.map((size) => (
        <Row key={size} title={size}>
          <Button size={size}>레이블만</Button>
          <Button size={size} leftIcon="plus">
            좌측 아이콘
          </Button>
          <Button size={size} rightIcon="arrow-right">
            우측 아이콘
          </Button>
        </Row>
      ))}
    </div>
  ),
};

/** 폼 제출처럼 가로를 채워야 할 때. 상세·등록·마이페이지 하단 버튼이 이 형태다. */
export const FullWidth: Story = {
  args: { children: "지도에서 길찾기" },
  render: () => (
    <div className="bg-background-default flex max-w-[360px] flex-col gap-3 p-6">
      <Button size="lg" fullWidth leftIcon="arrow-right">
        지도에서 길찾기
      </Button>
      <Button variant="secondary" size="lg" fullWidth leftIcon="logout">
        로그아웃
      </Button>
      <Button size="lg" fullWidth leftIcon="warning" disabled>
        오류를 확인해주세요
      </Button>
    </div>
  ),
};

const ICON_BUTTON_VARIANTS: IconButtonVariant[] = [
  "ghost",
  "circleBrand",
  "circleNeutral",
];

/** design.pen `IconButton/<variant>/48` 3종과, 인라인 편집용 32 사이즈. */
export const IconButtons: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      <Row title="48 (design.pen 정의 사이즈)">
        {ICON_BUTTON_VARIANTS.map((variant) => (
          <IconButton
            key={variant}
            variant={variant}
            icon="heart"
            label={`좋아요 ${variant}`}
          />
        ))}
      </Row>
      <Row title="32 (텍스트 옆 인라인)">
        <IconButton icon="edit" label="닉네임 수정" size={32} />
        <IconButton
          icon="close"
          label="닫기"
          size={32}
          variant="circleNeutral"
        />
      </Row>
    </div>
  ),
};

/** 디자인시스템 버튼 타입에 속하지 않는 외곽선형 소셜 로그인 버튼. */
export const SocialSignIn: Story = {
  args: { children: "" },
  render: () => (
    <div className="bg-background-default max-w-[320px] p-6">
      <SocialSignInButton />
    </div>
  ),
};
