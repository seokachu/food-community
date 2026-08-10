"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { FileItem, FileUploader } from "@/components/ui/FileUploader";
import { IconButton } from "@/components/ui/IconButton";
import { MapPreview } from "@/components/ui/MapPreview";
import { TextField } from "@/components/ui/TextField";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";
import { TopNavigation } from "@/components/ui/TopNavigation";
import {
  PLACE_ADDRESS_PENDING,
  PLACE_IMAGE_ACCEPT,
  validatePlaceContent,
  validatePlaceImages,
  validatePlaceTitle,
} from "@/lib/place-rules";

const INTRO_MAX_LENGTH = 2000;

/** 같은 파일을 두 번 고르면 목록이 중복되므로 이 키로 걸러낸다. */
const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

export default function RegisterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragover, setDragover] = useState(false);
  // 제출을 눌러 본 뒤에야 에러를 보여준다. 입력 도중에 빨간 화면을 만들지 않는다.
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // BFF(POST /api/places)와 같은 규칙(place-rules)으로 검사한다.
  const titleCheck = validatePlaceTitle(title);
  const contentCheck = validatePlaceContent(content);
  const imagesCheck = validatePlaceImages(files);

  const errors = {
    photo: imagesCheck.ok ? undefined : imagesCheck.message,
    title: titleCheck.ok ? undefined : titleCheck.message,
    content: contentCheck.ok ? undefined : contentCheck.message,
  };

  const hasError = Object.values(errors).some(Boolean);
  const showErrors = submitted && hasError;

  const handleFilesSelected = (selected: FileList) => {
    setDone(false);
    setServerError(null);
    setFiles((prev) => {
      const seen = new Set(prev.map(fileKey));
      return [...prev, ...Array.from(selected).filter((file) => !seen.has(fileKey(file)))];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);
    setDone(false);
    if (hasError || pending) return;

    setPending(true);
    try {
      const form = new FormData();
      form.set("title", title);
      form.set("content", content);
      files.forEach((file) => form.append("images", file));

      const response = await fetch("/api/places", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as {
        ok: boolean;
        error?: string;
      } | null;

      if (!response.ok || !body?.ok) {
        setServerError(body?.error ?? "등록에 실패했습니다. 잠시 후 다시 시도해주세요");
        return;
      }

      // 목록·상세 화면이 실데이터에 붙기 전이라 이 화면에서 완료를 알리고 폼을 비운다.
      setDone(true);
      setSubmitted(false);
      setTitle("");
      setContent("");
      setFiles([]);
    } finally {
      setPending(false);
    }
  };

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="맛집 등록"
          leading={<IconButton as={Link} href="/" icon="arrow-left" label="뒤로가기" />}
          trailing={
            <button
              type="button"
              className="text-label-lg text-text-secondary hover:text-text-default cursor-pointer px-3"
            >
              임시저장
            </button>
          }
        />
      }
    >
      <Container className="py-4 md:py-10">
        <NarrowColumn>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <header className="flex flex-col gap-2">
              <h1 className="text-display-sm lg:text-display-md text-text-default">
                나만 알던 한 끼를
                <br />
                이웃에게 소개해요
              </h1>
              <p className="text-body-md text-text-secondary">
                사진 한 장과 짧은 이야기면 충분해요.
              </p>
            </header>

            {serverError ? (
              <Toast tone="error" message={serverError} onClose={() => setServerError(null)} />
            ) : showErrors ? (
              <Toast tone="error" message="입력 내용을 확인해주세요" />
            ) : done ? (
              <Toast tone="success" message="맛집이 등록되었어요" onClose={() => setDone(false)} />
            ) : null}

            <FileUploader
              helperText={
                showErrors && errors.photo
                  ? `${errors.photo} · JPG, PNG, WebP · 최대 5MB`
                  : "JPG, PNG, WebP · 최대 5MB"
              }
              prompt={
                showErrors && errors.photo
                  ? "사진을 다시 선택해주세요"
                  : dragover
                    ? "여기에 놓아 업로드하세요"
                    : "사진을 드래그하거나 선택하세요"
              }
              error={Boolean(showErrors && errors.photo)}
              dragover={dragover}
              onDragOverChange={setDragover}
              accept={PLACE_IMAGE_ACCEPT}
              multiple
              disabled={pending}
              onFilesSelected={handleFilesSelected}
            >
              {files.map((file, index) => (
                <FileItem
                  key={fileKey(file)}
                  name={file.name}
                  state={pending ? "uploading" : "complete"}
                  statusText={pending ? undefined : "첨부 완료"}
                  onRemove={
                    pending
                      ? undefined
                      : () => setFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              ))}
            </FileUploader>

            <TextField
              label="맛집 이름 *"
              placeholder="맛집 이름 입력"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              error={showErrors ? errors.title : undefined}
              disabled={pending}
            />

            <Textarea
              label="소개 *"
              placeholder="맛집을 소개해주세요."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={INTRO_MAX_LENGTH}
              error={showErrors ? errors.content : undefined}
              disabled={pending}
            />

            {/* 주소 검색은 다음 단계에서 붙인다. 그때까지 서버가 자리표시 값으로 저장한다. */}
            <div className="flex flex-col gap-2">
              <TextField
                label="주소"
                leftIcon="search"
                placeholder="주소 검색은 준비 중이에요"
                value=""
                readOnly
                disabled
                hint={`지금 등록하면 주소는 "${PLACE_ADDRESS_PENDING}"으로 저장돼요`}
              />
              <Button variant="secondary" fullWidth leftIcon="search" disabled>
                주소 검색
              </Button>
              <MapPreview variant="empty" />
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={pending || showErrors}
              leftIcon={showErrors ? "warning" : "check"}
            >
              {pending ? "등록 중…" : showErrors ? "오류를 확인해주세요" : "등록하기"}
            </Button>
          </form>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
