"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/ui/Card";
import { FileItem, FileUploader } from "@/components/ui/FileUploader";
import { IconButton } from "@/components/ui/IconButton";
import { MapPreview } from "@/components/ui/MapPreview";
import { NaverMap } from "@/components/ui/NaverMap";
import { TextField } from "@/components/ui/TextField";
import { Textarea } from "@/components/ui/Textarea";
import { Toast } from "@/components/ui/Toast";
import { TopNavigation } from "@/components/ui/TopNavigation";
import {
  PLACE_IMAGE_ACCEPT,
  PLACE_IMAGE_MIN_COUNT,
  validatePlaceContent,
  validatePlaceImages,
  validatePlaceLocation,
  validatePlaceTitle,
} from "@/lib/place-rules";

import { PlacePicker, type ConfirmedPlace } from "./PlacePicker";

const INTRO_MAX_LENGTH = 2000;

/** 같은 파일을 두 번 고르면 목록이 중복되므로 이 키로 걸러낸다. */
const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

/** 수정 모드로 열 때 서버 컴포넌트가 내려주는 기존 글. */
export interface PlaceFormInitial {
  id: number;
  title: string;
  content: string;
  /** 지도 연동 전에 등록된 옛 글은 지도 정보가 없어 null — 다시 골라야 저장된다. */
  place: ConfirmedPlace | null;
  images: { id: string; url: string }[];
}

/**
 * 등록·수정 겸용 맛집 폼. `initial` 이 있으면 수정 모드가 되어
 * POST /api/places 대신 PATCH /api/places/[id] 를 부른다.
 * 네이버 지도 키는 서버 컴포넌트(page.tsx)가 읽어 프롭으로 내려보낸다.
 */
export function PlaceForm({
  naverMapClientId,
  initial,
}: {
  naverMapClientId: string;
  initial?: PlaceFormInitial;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [files, setFiles] = useState<File[]>([]);
  // 수정 모드에서 X 로 지운 기존 사진. 저장을 눌러야 서버에 반영된다.
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [place, setPlace] = useState<ConfirmedPlace | null>(initial?.place ?? null);
  // 장소 선택은 별도 라우트가 아니라 같은 페이지의 전체 화면 단계다.
  // 페이지를 떠나면 첨부 파일 상태를 잃기 때문이다.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragover, setDragover] = useState(false);
  // 제출을 눌러 본 뒤에야 에러를 보여준다. 입력 도중에 빨간 화면을 만들지 않는다.
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEdit = initial !== undefined;
  const backHref = isEdit ? `/places/${initial.id}` : "/";
  const keptImages = (initial?.images ?? []).filter(
    (image) => !removedImageIds.includes(image.id),
  );

  // BFF(POST·PATCH /api/places)와 같은 규칙(place-rules)으로 검사한다.
  const titleCheck = validatePlaceTitle(title);
  const contentCheck = validatePlaceContent(content);
  // 새 파일은 형식·용량만 보고, 장수 하한은 남는 기존 사진과 합쳐 판단한다(PATCH 와 같다).
  const imagesCheck = validatePlaceImages(files, 0);
  const imageCount = keptImages.length + files.length;
  // 지도 정보는 필수. PlacePicker 확정 값이 없으면 저장을 막는다.
  const locationCheck = validatePlaceLocation({
    name: place?.name,
    address: place?.address,
    lat: place?.position.lat,
    lng: place?.position.lng,
  });

  const errors = {
    photo: !imagesCheck.ok
      ? imagesCheck.message
      : imageCount < PLACE_IMAGE_MIN_COUNT
        ? "이미지를 1장 이상 첨부해주세요"
        : undefined,
    title: titleCheck.ok ? undefined : titleCheck.message,
    content: contentCheck.ok ? undefined : contentCheck.message,
    place: locationCheck.ok ? undefined : locationCheck.message,
  };

  const hasError = Object.values(errors).some(Boolean);
  const showErrors = submitted && hasError;

  const handleFilesSelected = (selected: FileList) => {
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
    if (hasError || pending) return;

    setPending(true);
    let saved = false;
    try {
      const form = new FormData();
      form.set("title", title);
      form.set("content", content);
      if (place) {
        form.set("name", place.name);
        form.set("address", place.address);
        form.set("lat", String(place.position.lat));
        form.set("lng", String(place.position.lng));
      }
      files.forEach((file) => form.append("images", file));
      removedImageIds.forEach((id) => form.append("removeImageIds", id));

      const response = await fetch(
        isEdit ? `/api/places/${initial.id}` : "/api/places",
        { method: isEdit ? "PATCH" : "POST", body: form },
      );
      const body = (await response.json().catch(() => null)) as {
        ok: boolean;
        error?: string;
      } | null;

      if (!response.ok || !body?.ok) {
        setServerError(
          body?.error ??
            `${isEdit ? "수정" : "등록"}에 실패했습니다. 잠시 후 다시 시도해주세요`,
        );
        // 에러 토스트는 폼 맨 위에 있어 스크롤이 내려가 있으면 안 보인다.
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      saved = true;
      if (isEdit) {
        // 상세로 돌아가면서 서버 컴포넌트가 수정된 값을 다시 읽게 한다.
        router.push(`/places/${initial.id}`);
        router.refresh();
      } else {
        // 등록 확인은 마이페이지 `내가 쓴 글` 목록에서 한다.
        router.push("/my");
      }
    } catch {
      setServerError(
        `${isEdit ? "수정" : "등록"}에 실패했습니다. 잠시 후 다시 시도해주세요`,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      // 이동이 시작된 뒤 버튼이 되살아나 두 번 제출되지 않도록 성공 시엔 pending 을 유지한다.
      if (!saved) setPending(false);
    }
  };

  if (pickerOpen) {
    return (
      <PlacePicker
        naverMapClientId={naverMapClientId}
        initialPlace={place}
        backLabel={isEdit ? "맛집 수정으로" : "맛집 등록으로"}
        onConfirm={(picked) => {
          setPlace(picked);
          setPickerOpen(false);
        }}
        onBack={() => setPickerOpen(false)}
      />
    );
  }

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title={isEdit ? "맛집 수정" : "맛집 등록"}
          leading={
            <IconButton as={Link} href={backHref} icon="arrow-left" label="뒤로가기" />
          }
          trailing={
            isEdit ? undefined : (
              <button
                type="button"
                className="text-label-lg text-text-secondary hover:text-text-default cursor-pointer px-3"
              >
                임시저장
              </button>
            )
          }
        />
      }
    >
      <Container className="py-4 md:py-10">
        <NarrowColumn>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <header className="flex flex-col gap-2">
              <h1 className="text-display-sm lg:text-display-md text-text-default">
                {isEdit ? (
                  <>
                    소개했던 한 끼를
                    <br />
                    다시 다듬어요
                  </>
                ) : (
                  <>
                    나만 알던 한 끼를
                    <br />
                    이웃에게 소개해요
                  </>
                )}
              </h1>
              <p className="text-body-md text-text-secondary">
                {isEdit
                  ? "사진과 장소, 이야기 모두 바꿀 수 있어요."
                  : "사진 한 장과 짧은 이야기면 충분해요."}
              </p>
            </header>

            {serverError ? (
              <Toast tone="error" message={serverError} onClose={() => setServerError(null)} />
            ) : showErrors ? (
              <Toast tone="error" message="입력 내용을 확인해주세요" />
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
              {keptImages.map((image, index) => (
                <FileItem
                  key={image.id}
                  name={`기존 사진 ${index + 1}`}
                  state="complete"
                  statusText="등록된 사진"
                  thumbnailSrc={image.url}
                  onRemove={
                    pending
                      ? undefined
                      : () => setRemovedImageIds((prev) => [...prev, image.id])
                  }
                />
              ))}
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

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                fullWidth
                leftIcon="search"
                disabled={pending}
                onClick={() => setPickerOpen(true)}
              >
                장소 입력하기 *
              </Button>
              {place ? (
                <>
                  <Card>
                    <CardBody className="p-4">
                      <CardTitle>{place.name}</CardTitle>
                      <CardDescription>{place.address}</CardDescription>
                    </CardBody>
                  </Card>
                  {/* 확정된 좌표의 실지도 미리보기. 조작은 막고 마커만 보여준다. */}
                  <NaverMap
                    clientId={naverMapClientId}
                    center={place.position}
                    marker={place.position}
                    centerPin={false}
                    interactive={false}
                    zoom={16}
                    className="h-[146px] rounded-2xl"
                  />
                </>
              ) : (
                <MapPreview variant="empty" />
              )}
              {showErrors && errors.place && (
                <p className="text-label-md text-text-error">{errors.place}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={pending || showErrors}
              leftIcon={showErrors ? "warning" : "check"}
            >
              {pending
                ? isEdit
                  ? "수정 중…"
                  : "등록 중…"
                : showErrors
                  ? "오류를 확인해주세요"
                  : isEdit
                    ? "수정하기"
                    : "등록하기"}
            </Button>
          </form>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
