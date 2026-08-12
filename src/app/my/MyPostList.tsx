"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardDescription,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Toast } from "@/components/ui/Toast";

export interface MyPost {
  id: number;
  title: string;
  /** 카드 설명 줄. 예: "2026.08.10 · 등록 대기중" */
  meta: string;
  thumbnailUrl?: string;
}

type ToastState = { tone: "success" | "error"; message: string } | null;

/**
 * 마이페이지 `내가 쓴 글` 그리드. 카드를 누르면 상세(/places/[id])로 가고,
 * 카드 우상단 X 버튼이 BFF(DELETE /api/places/[id])로 소프트삭제를 요청한 뒤
 * router.refresh() 로 서버 컴포넌트 목록을 다시 그린다.
 */
export function MyPostList({ posts }: { posts: MyPost[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const deletePost = async (post: MyPost) => {
    if (deletingId !== null) return;
    setDeletingId(post.id);
    try {
      const response = await fetch(`/api/places/${post.id}`, {
        method: "DELETE",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error ?? "삭제에 실패했습니다");
      }
      setToast({ tone: "success", message: `"${post.title}" 글을 삭제했어요` });
      router.refresh();
    } catch (reason) {
      setToast({
        tone: "error",
        message:
          reason instanceof Error ? reason.message : "삭제에 실패했습니다",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {toast && (
        <Toast
          tone={toast.tone}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id} className="relative flex">
            <Card as={Link} href={`/places/${post.id}`} className="w-full">
              <CardMedia
                src={post.thumbnailUrl}
                alt={post.title}
                className="h-26 sm:aspect-[16/9] sm:h-auto"
              />
              <CardBody className="p-3 sm:p-4">
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.meta}</CardDescription>
              </CardBody>
            </Card>
            <IconButton
              icon="close"
              label={`${post.title} 삭제`}
              size={32}
              variant="circleNeutral"
              className="absolute top-2 right-2"
              disabled={deletingId === post.id}
              onClick={() => deletePost(post)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
