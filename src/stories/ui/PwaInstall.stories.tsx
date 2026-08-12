"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  IosInstallGuideSheet,
  PwaInstallBannerView,
} from "@/components/ui/PwaInstallBanner";

const meta = {
  title: "UI/PwaInstall",
  component: PwaInstallBannerView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PwaInstallBannerView>;

export default meta;
type Story = StoryObj<typeof PwaInstallBannerView>;

const noop = () => {};

/** Android(Chromium). 클릭하면 네이티브 설치 프롬프트가 바로 열린다. */
export const AndroidBanner: Story = {
  args: { mode: "android", onInstall: noop, onDismiss: noop },
  render: (args) => (
    <div className="bg-background-default min-h-[200px]">
      <PwaInstallBannerView {...args} />
    </div>
  ),
};

/** iOS. 프로그래매틱 설치가 없어 클릭 시 수동 가이드 바텀시트를 연다. */
export const IosBanner: Story = {
  args: { mode: "ios", onInstall: noop, onDismiss: noop },
  render: function IosBannerStory(args) {
    const [guideOpen, setGuideOpen] = useState(false);

    return (
      <div className="bg-background-default min-h-[480px]">
        <PwaInstallBannerView {...args} onInstall={() => setGuideOpen(true)} />
        <IosInstallGuideSheet
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
        />
      </div>
    );
  },
};

/** iOS 설치 가이드 바텀시트 단독. */
export const IosInstallGuide: Story = {
  args: { mode: "ios", onInstall: noop, onDismiss: noop },
  render: function IosGuideStory() {
    const [open, setOpen] = useState(true);

    return (
      <div className="bg-background-default min-h-[480px] p-6">
        <Button onClick={() => setOpen(true)}>가이드 열기</Button>
        <IosInstallGuideSheet open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
