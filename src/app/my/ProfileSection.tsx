"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileItem,
  FileUploader,
  type FileItemState,
} from "@/components/ui/FileUploader";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { Toast } from "@/components/ui/Toast";
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PROFILE_IMAGE_ACCEPT,
  PROFILE_IMAGE_MAX_BYTES,
  PROFILE_IMAGE_TYPES,
  validateNickname,
} from "@/lib/profile-rules";

interface ProfileSectionProps {
  nickname: string;
  /** profile 이미지가 있으면 그 URL, 없으면 Google 아바타. */
  avatarUrl?: string;
}

interface UploadItem {
  name: string;
  state: FileItemState;
  statusText?: string;
}

type ToastState = { tone: "success" | "error"; message: string } | null;

/**
 * 마이페이지 프로필 블록. 닉네임·사진 변경 모달을 열고 BFF(/api/profile)를
 * 호출한 뒤 router.refresh() 로 서버 컴포넌트가 최신 값을 다시 그리게 한다.
 */
export function ProfileSection({ nickname, avatarUrl }: ProfileSectionProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(nickname);
  const [draftError, setDraftError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const [photoOpen, setPhotoOpen] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [item, setItem] = useState<UploadItem | null>(null);
  const uploading = item?.state === "uploading";

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const openEdit = () => {
    setDraft(nickname);
    setDraftError(undefined);
    setEditOpen(true);
  };

  const saveNickname = async () => {
    const checked = validateNickname(draft);
    if (!checked.ok) {
      setDraftError(checked.message);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: checked.value }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error ?? "닉네임 변경에 실패했습니다");
      }
      setEditOpen(false);
      setToast({ tone: "success", message: "닉네임을 변경했어요" });
      router.refresh();
    } catch (reason) {
      setDraftError(
        reason instanceof Error ? reason.message : "닉네임 변경에 실패했습니다",
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!PROFILE_IMAGE_TYPES[file.type]) {
      setItem({
        name: file.name,
        state: "error",
        statusText: "JPG, PNG, WebP 이미지만 올릴 수 있어요",
      });
      return;
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      setItem({
        name: file.name,
        state: "error",
        statusText: "이미지는 5MB 이하로 올려주세요",
      });
      return;
    }

    setItem({ name: file.name, state: "uploading" });
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: form,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error ?? "업로드에 실패했습니다");
      }
      setPhotoOpen(false);
      setItem(null);
      setToast({ tone: "success", message: "프로필 사진을 변경했어요" });
      router.refresh();
    } catch (reason) {
      setItem({
        name: file.name,
        state: "error",
        statusText:
          reason instanceof Error ? reason.message : "업로드에 실패했습니다",
      });
    }
  };

  return (
    <section className="flex flex-col gap-3">
      {toast && (
        <Toast
          tone={toast.tone}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center gap-4">
        <Avatar
          size={88}
          tone="brand"
          src={avatarUrl}
          alt={`${nickname} 프로필 사진`}
        />
        <div className="flex flex-col items-start gap-2.5">
          <div className="flex items-center gap-2">
            <h1 className="text-heading-md text-text-default">{nickname}</h1>
            <IconButton
              icon="edit"
              label="닉네임 수정"
              size={32}
              onClick={openEdit}
            />
          </div>
          <Badge tone="brand">Google 계정 연결됨</Badge>
          <Button
            variant="secondary"
            leftIcon="image"
            onClick={() => {
              setItem(null);
              setDragover(false);
              setPhotoOpen(true);
            }}
          >
            프로필 사진 변경
          </Button>
        </div>
      </div>

      <Modal
        open={editOpen}
        title="닉네임 수정"
        onClose={() => {
          if (!saving) setEditOpen(false);
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditOpen(false)}
              disabled={saving}
            >
              취소
            </Button>
            <Button onClick={saveNickname} loading={saving}>
              저장
            </Button>
          </>
        }
      >
        <TextField
          label="닉네임"
          value={draft}
          maxLength={NICKNAME_MAX_LENGTH}
          hint={`${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자`}
          error={draftError}
          onChange={(event) => {
            setDraft(event.target.value);
            setDraftError(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !saving) saveNickname();
          }}
        />
      </Modal>

      <Modal
        open={photoOpen}
        title="프로필 사진 변경"
        onClose={() => {
          if (!uploading) setPhotoOpen(false);
        }}
        footer={
          <Button
            variant="secondary"
            onClick={() => setPhotoOpen(false)}
            disabled={uploading}
          >
            닫기
          </Button>
        }
      >
        <FileUploader
          helperText="JPG, PNG, WebP · 최대 5MB"
          accept={PROFILE_IMAGE_ACCEPT}
          dragover={dragover}
          onDragOverChange={setDragover}
          onFilesSelected={uploadImage}
          disabled={uploading}
          error={item?.state === "error"}
        >
          {item && (
            <FileItem
              name={item.name}
              state={item.state}
              statusText={item.statusText}
              onRemove={
                item.state === "error" ? () => setItem(null) : undefined
              }
            />
          )}
        </FileUploader>
      </Modal>
    </section>
  );
}
