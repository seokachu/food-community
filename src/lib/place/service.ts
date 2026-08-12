import "server-only";

import { PLACE_IMAGE_TYPES } from "@/lib/place-rules";
import type { SupabaseServerClient } from "@/lib/supabase/server";
import { PLACE_IMAGE_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";

/** 목록·상세·등록·수정 응답이 같은 모양을 쓰도록 select 를 하나로 고정한다. */
export const PLACE_SELECT =
  "id, title, content, address, name, lat, lng, created_at, user_id, place_image(id, image_path)";

export interface PlaceRow {
  id: number;
  title: string;
  content: string;
  address: string;
  /** 장소명·좌표. 지도 연동 전에 등록된 옛 글에는 없어 null 일 수 있다. */
  name: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  user_id: string;
  place_image: { id: string; image_path: string }[];
}

/** BFF 응답용 뷰. image_path 는 여기서만 전체 URL 이 된다. */
export interface PlaceView {
  id: number;
  title: string;
  content: string;
  address: string;
  /** 장소명·좌표. 지도 연동 전에 등록된 옛 글에는 없어 null 일 수 있다. */
  name: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  userId: string;
  images: { id: string; url: string }[];
}

export function toPlaceView(row: PlaceRow): PlaceView {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    address: row.address,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    createdAt: row.created_at,
    userId: row.user_id,
    images: row.place_image.map((image) => ({
      id: image.id,
      url: publicStorageUrl(PLACE_IMAGE_BUCKET, image.image_path),
    })),
  };
}

/**
 * 이미지 포함 place 한 건. 없거나 조회에 실패하면 null(실패는 로그로 남긴다).
 * 소프트삭제된 글은 없는 글과 똑같이 취급한다.
 */
export async function getPlaceRow(
  supabase: SupabaseServerClient,
  id: number,
): Promise<PlaceRow | null> {
  const { data, error } = await supabase
    .from("place")
    .select(PLACE_SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .order("created_at", { referencedTable: "place_image", ascending: true })
    .maybeSingle();

  if (error) {
    console.error("[place] 조회 실패", { id, error });
    return null;
  }
  return data;
}

/** 특정 사용자가 쓴 글 목록(최신순, 소프트삭제 제외). 실패하면 null. */
export async function getUserPlaceRows(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<PlaceRow[] | null> {
  const { data, error } = await supabase
    .from("place")
    .select(PLACE_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "place_image", ascending: true });

  if (error) {
    console.error("[place] 내 글 목록 조회 실패", { userId, error });
    return null;
  }
  return data;
}

/**
 * `<user_id>/<uuidv4>.<ext>` 경로로 업로드한다. 첫 폴더명이 소유자여야
 * Storage RLS(own-folder 정책)를 통과한다. 파일 검증(validatePlaceImages)은
 * 호출 전에 끝났다고 가정한다. 하나라도 실패하면 올라간 파일을 지우고 null.
 */
export async function uploadPlaceImages(
  supabase: SupabaseServerClient,
  userId: string,
  files: File[],
): Promise<string[] | null> {
  const results = await Promise.all(
    files.map(async (file) => {
      const path = `${userId}/${crypto.randomUUID()}.${PLACE_IMAGE_TYPES[file.type]}`;
      const { error } = await supabase.storage
        .from(PLACE_IMAGE_BUCKET)
        .upload(path, file, { contentType: file.type });
      return { path, error };
    }),
  );

  const failed = results.filter((result) => result.error);
  if (failed.length === 0) {
    return results.map((result) => result.path);
  }

  console.error("[place] 이미지 업로드 실패", {
    userId,
    errors: failed.map((result) => result.error),
  });
  await removePlaceImages(
    supabase,
    results.filter((result) => !result.error).map((result) => result.path),
  );
  return null;
}

/** 스토리지 파일 정리. 실패해도 흐름을 막지 않고 기록만 남긴다. */
export async function removePlaceImages(
  supabase: SupabaseServerClient,
  paths: string[],
) {
  if (paths.length === 0) return;

  const { error } = await supabase.storage
    .from(PLACE_IMAGE_BUCKET)
    .remove(paths);
  if (error) {
    console.error("[place] 스토리지 파일 정리 실패", { paths, error });
  }
}
