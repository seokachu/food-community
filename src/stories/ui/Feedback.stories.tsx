import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonText,
} from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Toast, type ToastTone } from "@/components/ui/Toast";

const meta = {
  title: "UI/Feedback",
  component: Toast,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

const TONES: ToastTone[] = ["success", "error", "info", "warning"];
const MESSAGES: Record<ToastTone, string> = {
  success: "저장이 완료되었습니다.",
  error: "저장하지 못했습니다. 다시 시도해 주세요.",
  info: "임시저장된 내용을 불러왔습니다.",
  warning: "사진 용량이 큽니다. 업로드가 느릴 수 있어요.",
};

/**
 * 배경은 네 톤 모두 inverse 고 테두리와 상태 아이콘 색만 다르다.
 *
 * 상태 아이콘 색은 시안 그대로(icon-error / icon-success ...)라 어두운 배경 위에서
 * 대비가 낮다. 의미는 메시지 텍스트가 전달하므로 아이콘은 aria 에서 감춘다.
 */
export const Toasts: Story = {
  args: { message: MESSAGES.info },
  render: () => (
    <div className="bg-background-default flex max-w-[400px] flex-col gap-3 p-6">
      {TONES.map((tone) => (
        <Toast key={tone} tone={tone} message={MESSAGES[tone]} />
      ))}
      <Toast tone="error" message={MESSAGES.error} onClose={() => {}} />
    </div>
  ),
};

/** md(24) 한 가지. 색은 currentColor 를 따라 버튼 안에서도 그대로 쓰인다. */
export const Spinners: Story = {
  args: { message: "" },
  render: () => (
    <div className="bg-background-default flex items-center gap-6 p-6">
      <Spinner label="불러오는 중" />
      <div className="bg-background-inverse flex items-center gap-2 rounded-xl p-4">
        <Spinner className="text-icon-on-inverse" />
        <span className="text-body-md text-text-on-inverse">
          어두운 배경 위
        </span>
      </div>
    </div>
  ),
};

/** 비주얼 · 제목 · 설명 · 액션. 액션은 0~2개다. */
export const Empty: Story = {
  args: { message: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-6 p-6">
      <EmptyState
        icon="search"
        title="아직 등록된 맛집이 없어요"
        description="첫 번째 숨은 맛집을 등록하거나 다른 동네의 이야기를 둘러보세요."
        actions={
          <>
            <Button variant="secondary">둘러보기</Button>
            <Button leftIcon="plus">등록하기</Button>
          </>
        }
        className="border-border-default rounded-2xl border"
      />
      <EmptyState
        icon="bookmark"
        title="아직 등록한 맛집이 없어요"
        description="첫 발견을 기록하면 나만의 주말 맛집 지도가 시작돼요."
        actions={<Button leftIcon="plus">첫 맛집 등록하기</Button>}
        className="border-border-default rounded-2xl border"
      />
    </div>
  ),
};

/**
 * design.pen `Skeleton/<Text|Rectangle|Circle>`. 색은 뉴트럴 하나다.
 * .pen 은 정지 상태만 담지만 웹에서는 로딩 중임을 알리는 맥동이 기본 기대라 pulse 를 넣었다.
 */
export const Skeletons: Story = {
  args: { message: "" },
  render: () => (
    <div className="bg-background-default flex flex-col gap-8 p-6">
      <div className="max-w-[280px]">
        <SkeletonText />
      </div>
      <SkeletonRectangle className="max-w-[280px] h-28" />
      <SkeletonCircle />

      <div className="border-border-default max-w-[280px] rounded-2xl border">
        <SkeletonRectangle className="h-26 rounded-t-2xl rounded-b-none" />
        <div className="flex flex-col gap-2 p-3">
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  ),
};
