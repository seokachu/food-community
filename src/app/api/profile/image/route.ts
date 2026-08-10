import { NextResponse } from "next/server";

import {
  displayNameOfClaims,
  getProfile,
  toProfileView,
} from "@/lib/auth/profile";
import {
  PROFILE_IMAGE_MAX_BYTES,
  PROFILE_IMAGE_TYPES,
} from "@/lib/profile-rules";
import { createClient } from "@/lib/supabase/server";
import { PROFILE_IMAGE_BUCKET } from "@/lib/supabase/storage";

/**
 * POST /api/profile/image — 프로필 사진 교체. multipart form-data 의 `file` 하나.
 * `<user_id>/<uuidv4>.<ext>` 경로로 올린다. 첫 폴더명이 소유자여야
 * Storage RLS(own-folder 정책)를 통과한다.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (!claims) {
      return NextResponse.json(
        { ok: false, error: "로그인이 필요합니다" },
        { status: 401 },
      );
    }
    const userId = claims.sub as string;

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "이미지 파일을 첨부해주세요" },
        { status: 400 },
      );
    }

    const ext = PROFILE_IMAGE_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "JPG, PNG, WebP 이미지만 올릴 수 있어요" },
        { status: 400 },
      );
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "이미지는 5MB 이하로 올려주세요" },
        { status: 400 },
      );
    }

    // 교체 후 지울 이전 경로를 미리 확보한다.
    const existing = await getProfile(supabase, userId);
    const imagePath = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(imagePath, file, { contentType: file.type });

    if (uploadError) {
      console.error("[profile] 이미지 업로드 실패", { userId, uploadError });
      return NextResponse.json(
        { ok: false, error: "이미지 업로드에 실패했습니다" },
        { status: 500 },
      );
    }

    const { data: row, error: dbError } = await supabase
      .from("profile")
      .upsert(
        {
          user_id: userId,
          nickname: existing?.nickname ?? displayNameOfClaims(claims),
          image_path: imagePath,
        },
        { onConflict: "user_id" },
      )
      .select("nickname, image_path")
      .single();

    if (dbError || !row) {
      // DB 기록에 실패했으면 방금 올린 파일을 지워 고아를 만들지 않는다.
      await supabase.storage.from(PROFILE_IMAGE_BUCKET).remove([imagePath]);
      console.error("[profile] 이미지 경로 저장 실패", { userId, dbError });
      return NextResponse.json(
        { ok: false, error: "프로필 저장에 실패했습니다" },
        { status: 500 },
      );
    }

    // 이전 이미지 정리. 실패해도 교체 자체는 성공이므로 기록만 남긴다.
    if (existing?.imagePath && existing.imagePath !== imagePath) {
      const { error: removeError } = await supabase.storage
        .from(PROFILE_IMAGE_BUCKET)
        .remove([existing.imagePath]);
      if (removeError) {
        console.error("[profile] 이전 이미지 삭제 실패", {
          userId,
          imagePath: existing.imagePath,
          removeError,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      profile: toProfileView(
        { nickname: row.nickname, imagePath: row.image_path },
        claims,
      ),
    });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
