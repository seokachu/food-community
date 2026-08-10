"use client";

import { useId, type ChangeEvent, type DragEvent, type ReactNode } from "react";

import { Icon } from "@/components/foundation/Icon";
import { cn } from "@/lib/cn";

import { IconButton } from "./IconButton";
import { Spinner } from "./Spinner";

/** design.pen `FileItem/<state>` 3종에 대응한다. */
export type FileItemState = "uploading" | "complete" | "error";

export interface FileItemProps {
  name: string;
  state: FileItemState;
  /** 상태 문구. 생략하면 상태별 기본 문구를 쓴다. */
  statusText?: string;
  thumbnailSrc?: string;
  onRemove?: () => void;
}

const defaultStatusText: Record<FileItemState, string> = {
  uploading: "업로드 중",
  complete: "업로드 완료",
  error: "업로드 실패",
};

export function FileItem({
  name,
  state,
  statusText,
  thumbnailSrc,
  onRemove,
}: FileItemProps) {
  const isError = state === "error";

  return (
    <div
      className={cn(
        "bg-background-default flex h-18 w-full items-center gap-2.5 rounded-xl border p-3",
        isError ? "border-border-error" : "border-border-default",
      )}
    >
      <span
        style={thumbnailSrc ? { backgroundImage: `url(${thumbnailSrc})` } : undefined}
        className="bg-background-inverse flex size-12 shrink-0 items-center justify-center rounded-lg bg-cover bg-center"
      >
        {!thumbnailSrc && (
          <Icon name="image" size={24} className="text-icon-on-inverse" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn(
            "text-body-md truncate",
            isError ? "text-text-error" : "text-text-default",
          )}
        >
          {name}
        </p>
        <p
          className={cn(
            "text-label-md",
            isError
              ? "text-text-error"
              : state === "complete"
                ? "text-text-success"
                : "text-text-muted",
          )}
        >
          {statusText ?? defaultStatusText[state]}
        </p>
      </div>

      {state === "uploading" && <Spinner size={20} />}
      {state === "complete" && (
        <Icon name="check" size={20} className="text-icon-success shrink-0" />
      )}
      {state === "error" && (
        <Icon name="error" size={20} className="text-icon-error shrink-0" />
      )}

      {onRemove && (
        <IconButton icon="delete" label={`${name} 삭제`} onClick={onRemove} />
      )}
    </div>
  );
}

/**
 * design.pen `FileUploader/<state>` 4종에 대응한다.
 * 드롭존과 파일선택 버튼이 결합된 단일형이고, 아래에 파일 아이템 리스트가 붙는다.
 */
export interface FileUploaderProps {
  /** 파일 형식·용량 안내. error 일 때는 에러색으로 바뀐다. */
  helperText: string;
  /**
   * 드롭존 안내문구. 생략하면 상태에 맞는 기본 문구를 쓴다
   * (dragover 일 때는 design.pen 처럼 "여기에 놓아 업로드하세요" 로 바뀐다).
   */
  prompt?: string;
  error?: boolean;
  disabled?: boolean;
  dragover?: boolean;
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: FileList) => void;
  onDragOverChange?: (dragover: boolean) => void;
  /** FileItem 목록. */
  children?: ReactNode;
  className?: string;
}

export function FileUploader({
  helperText,
  prompt,
  error = false,
  disabled = false,
  dragover = false,
  accept,
  multiple,
  onFilesSelected,
  onDragOverChange,
  children,
  className,
}: FileUploaderProps) {
  const inputId = useId();
  const promptText =
    prompt ?? (dragover ? "여기에 놓아 업로드하세요" : "파일을 드래그하거나 선택하세요");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) onFilesSelected?.(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onDragOverChange?.(false);
    if (disabled) return;
    if (event.dataTransfer.files?.length) onFilesSelected?.(event.dataTransfer.files);
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <p
        className={cn(
          "text-label-md",
          error
            ? "text-text-error"
            : disabled
              ? "text-text-on-disabled"
              : "text-text-muted",
        )}
      >
        {helperText}
      </p>

      {/* label 이 곧 드롭존이다. 숨은 input 을 감싸므로 클릭·키보드 접근이 그대로 살아난다. */}
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) onDragOverChange?.(true);
        }}
        onDragLeave={() => onDragOverChange?.(false)}
        onDrop={handleDrop}
        className={cn(
          "focus-within:outline-border-brand flex h-[150px] w-full flex-col items-center justify-center gap-2.5 rounded-[14px] border p-3 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2",
          disabled
            ? "bg-background-disabled border-border-default cursor-not-allowed"
            : "bg-background-default cursor-pointer",
          !disabled && error && "border-border-error",
          // dragover 는 시안이 2px 브랜드 테두리다. 두께를 바꾸면 드롭존 높이가
          // 1px 흔들려서 안쪽 내용이 튀므로 링을 얹어 같은 두께로 보이게 한다.
          !disabled &&
            !error &&
            dragover &&
            "border-border-brand ring-1 ring-border-brand",
          !disabled && !error && !dragover && "border-border-default",
        )}
      >
        <Icon
          name="image"
          size={24}
          className={error ? "text-icon-error" : "text-icon-muted"}
        />
        <span
          className={cn(
            "text-body-md",
            error
              ? "text-text-error"
              : disabled
                ? "text-text-on-disabled"
                : "text-text-default",
          )}
        >
          {promptText}
        </span>
        {/* 실제 버튼이 아니라 시각 표현이다. label 안의 button 은 파일 선택을 가로챈다. */}
        <span
          className={cn(
            "text-label-lg bg-background-inverse text-text-on-inverse inline-flex h-8 items-center rounded-[10px] px-3",
            disabled && "bg-background-disabled text-text-on-disabled",
          )}
        >
          파일 선택
        </span>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
        />
      </label>

      {children}
    </div>
  );
}
