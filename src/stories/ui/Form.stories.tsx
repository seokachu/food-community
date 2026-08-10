import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FileItem, FileUploader } from "@/components/ui/FileUploader";
import { TextField, type TextFieldSize } from "@/components/ui/TextField";
import { Textarea } from "@/components/ui/Textarea";

const meta = {
  title: "UI/Form",
  component: TextField,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof TextField>;

const SIZES: TextFieldSize[] = ["sm", "md", "lg"];

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

/**
 * 상태(열) 4종. focused 는 실제 포커스로만 나타나므로 스토리에서는 생략하고
 * 필드를 클릭해 확인한다. 테두리 두께 대신 링을 얹어 높이가 흔들리지 않게 했다.
 */
export const TextFields: Story = {
  args: { label: "맛집 이름" },
  render: () => (
    <Grid>
      <TextField
        label="맛집 이름"
        placeholder="맛집 이름 입력"
        hint="영문·숫자를 입력해주세요"
      />
      <TextField
        label="맛집 이름"
        defaultValue="오류동 숯불구이"
        hint="클릭하면 focused 상태가 된다"
      />
      <TextField
        label="맛집 이름"
        placeholder="맛집 이름 입력"
        hint="영문·숫자를 입력해주세요"
        disabled
      />
      <TextField
        label="맛집 이름"
        defaultValue="산"
        error="맛집 이름을 2자 이상 입력해주세요"
      />
    </Grid>
  ),
};

/** sm(32) · md(40) · lg(48). 좌우 패딩과 라운드가 함께 커진다. */
export const TextFieldSizes: Story = {
  args: { label: "맛집 이름" },
  render: () => (
    <Grid>
      {SIZES.map((size) => (
        <TextField
          key={size}
          fieldSize={size}
          label={`맛집 이름 (${size})`}
          placeholder="맛집 이름 입력"
          leftIcon="search"
          hint="좌측 아이콘 포함"
        />
      ))}
    </Grid>
  ),
};

/** 레이블 없이 컨트롤만 쓰는 형태. 메인 화면 검색 필드가 이 모양이다. */
export const SearchField: Story = {
  args: { label: undefined },
  render: () => (
    <div className="bg-background-default max-w-[360px] p-6">
      <TextField leftIcon="search" placeholder="맛집을 검색해보세요" />
    </div>
  ),
};

/** 3줄 고정 높이(92px). 헬퍼와 글자수 카운터가 한 행에서 양끝 정렬된다. */
export const Textareas: Story = {
  args: { label: "소개" },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2">
      <Textarea
        label="맛집 소개"
        placeholder="맛집을 소개해주세요."
        hint="최대 200자까지 입력할 수 있어요"
        maxLength={200}
      />
      <Textarea
        label="소개 *"
        defaultValue="정말 맛있어요"
        currentLength={8}
        error="소개를 10자 이상 입력해주세요"
        maxLength={2000}
      />
      <Textarea
        label="맛집 소개"
        placeholder="맛집을 소개해주세요."
        hint="최대 200자까지 입력할 수 있어요"
        maxLength={200}
        disabled
      />
    </div>
  ),
};

/** 드롭존 + 파일선택 버튼 결합형. 아래에 파일 아이템 리스트가 붙는다. */
export const FileUploaders: Story = {
  args: { label: undefined },
  render: () => (
    <div className="bg-background-default grid gap-6 p-6 sm:grid-cols-2">
      <FileUploader helperText="JPG, PNG · 최대 10MB">
        <FileItem name="restaurant-photo.jpg" state="complete" onRemove={() => {}} />
      </FileUploader>
      <FileUploader
        helperText="사진을 다시 확인해주세요 · JPG, PNG · 최대 10MB"
        prompt="사진을 다시 선택해주세요"
        error
      >
        <FileItem name="menu-photo.jpg" state="error" onRemove={() => {}} />
      </FileUploader>
      <FileUploader helperText="JPG, PNG · 최대 10MB" dragover>
        <FileItem name="uploading-photo.jpg" state="uploading" />
      </FileUploader>
      <FileUploader helperText="JPG, PNG · 최대 10MB" disabled />
    </div>
  ),
};
