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

const INTRO_MAX_LENGTH = 2000;

/** 주소 검색 SDK 자리. 지금은 버튼을 누르면 시안의 주소가 들어온다. */
const SAMPLE_ADDRESS = "경기 광명시 가학로 88 산마루 1층";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [dragover, setDragover] = useState(false);
  // 제출을 눌러 본 뒤에야 에러를 보여준다. 입력 도중에 빨간 화면을 만들지 않는다.
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    photo: photo ? undefined : "사진을 한 장 이상 올려주세요",
    name: name.trim().length >= 2 ? undefined : "맛집 이름을 2자 이상 입력해주세요",
    intro: intro.trim().length >= 10 ? undefined : "소개를 10자 이상 입력해주세요",
    address: address ? undefined : "주소를 검색해서 선택해주세요",
  };

  const hasError = Object.values(errors).some(Boolean);
  const showErrors = submitted && hasError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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

            {showErrors && <Toast tone="error" message="입력 내용을 확인해주세요" />}

            <FileUploader
              helperText={
                showErrors && errors.photo
                  ? "사진을 다시 확인해주세요 · JPG, PNG · 최대 10MB"
                  : "JPG, PNG · 최대 10MB"
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
              accept="image/jpeg,image/png"
              onFilesSelected={(files) => setPhoto(files[0]?.name ?? null)}
            >
              {photo && (
                <FileItem
                  name={photo}
                  state="complete"
                  onRemove={() => setPhoto(null)}
                />
              )}
            </FileUploader>

            <TextField
              label="맛집 이름 *"
              placeholder="맛집 이름 입력"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={showErrors ? errors.name : undefined}
            />

            <Textarea
              label="소개 *"
              placeholder="맛집을 소개해주세요."
              value={intro}
              onChange={(event) => setIntro(event.target.value)}
              maxLength={INTRO_MAX_LENGTH}
              error={showErrors ? errors.intro : undefined}
            />

            <div className="flex flex-col gap-2">
              <TextField
                label="주소 *"
                leftIcon="search"
                placeholder="주소를 검색해주세요"
                value={address}
                readOnly
                error={showErrors ? errors.address : undefined}
              />
              <Button
                variant="secondary"
                fullWidth
                leftIcon="search"
                onClick={() => setAddress(SAMPLE_ADDRESS)}
              >
                주소 검색
              </Button>
              {address ? (
                <MapPreview caption="광명동 · 가학산 입구" />
              ) : (
                <MapPreview variant="empty" />
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={showErrors}
              leftIcon={showErrors ? "warning" : "check"}
            >
              {showErrors ? "오류를 확인해주세요" : "등록하기"}
            </Button>
          </form>
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
