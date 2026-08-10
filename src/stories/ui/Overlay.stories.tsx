"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { Modal } from "@/components/ui/Modal";
import { SelectItem } from "@/components/ui/Select";

const meta = {
  title: "UI/Overlay",
  component: Menu,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof Menu>;

/** 타입(default/destructive) x 상태(default/disabled) x 사이즈(sm/md/lg). */
export const MenuItems: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default flex flex-col gap-6 p-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex max-w-[240px] flex-col gap-2">
          <h3 className="text-label-lg text-text-muted">{size}</h3>
          <MenuItem size={size} icon="edit" label="수정하기" />
          <MenuItem size={size} icon="edit" label="수정하기" disabled />
          <MenuItem size={size} icon="delete" label="삭제하기" tone="destructive" />
          <MenuItem
            size={size}
            icon="delete"
            label="삭제하기"
            tone="destructive"
            disabled
          />
        </div>
      ))}
    </div>
  ),
};

/** 아이템을 감싸는 패널. 데스크톱에서는 메뉴 버튼 아래에, 모바일에서는 바텀시트 안에 놓인다. */
export const MenuPanel: Story = {
  args: { children: null },
  render: () => (
    <div className="bg-background-default max-w-[256px] p-6">
      <Menu>
        <MenuItem icon="edit" label="수정하기" />
        <MenuItem icon="share" label="공유하기" />
        <MenuItem icon="delete" label="삭제하기" tone="destructive" />
      </Menu>
    </div>
  ),
};

/** 헤더 · 바디 · 푸터(secondary + primary) + 스크림. 스크림이나 Esc 로 닫힌다. */
export const Modals: Story = {
  args: { children: null },
  render: function ModalStory() {
    const [open, setOpen] = useState(false);

    return (
      <div className="bg-background-default p-6">
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          open={open}
          title="맛집 등록을 완료할까요?"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setOpen(false)}>완료</Button>
            </>
          }
        >
          등록한 내용은 이웃에게 공개됩니다. 입력한 정보를 한 번 더 확인해 주세요.
        </Modal>
      </div>
    );
  },
};

/** 드래그 핸들 + 콘텐츠 + 스크림. 모바일에서 셀렉트 패널로 자주 쓰인다. */
export const BottomSheets: Story = {
  args: { children: null },
  render: function SheetStory() {
    const [open, setOpen] = useState(false);
    const [region, setRegion] = useState("guro");

    return (
      <div className="bg-background-default p-6">
        <Button onClick={() => setOpen(true)}>바텀시트 열기</Button>
        <BottomSheet
          open={open}
          label="지역 선택"
          onClose={() => setOpen(false)}
        >
          <h2 className="text-heading-sm text-text-default">
            지역을 선택해 주세요
          </h2>
          <p className="text-body-md text-text-secondary">
            선택하지 않고 바깥 영역을 누르면 닫힙니다.
          </p>
          <div className="mt-2 flex w-full flex-col gap-2">
            {[
              { id: "guro", label: "서울 · 구로구" },
              { id: "oryu", label: "서울 · 오류동" },
              { id: "bucheon", label: "경기 · 부천시" },
            ].map((item) => (
              <SelectItem
                key={item.id}
                label={item.label}
                selected={region === item.id}
                onSelect={() => {
                  setRegion(item.id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </BottomSheet>
      </div>
    );
  },
};
