import { NextResponse } from "next/server";

import {
  PLACE_ADDRESS_PENDING,
  validatePlaceContent,
  validatePlaceImages,
  validatePlaceTitle,
} from "@/lib/place-rules";
import {
  getPlaceRow,
  PLACE_SELECT,
  removePlaceImages,
  toPlaceView,
  uploadPlaceImages,
} from "@/lib/place/service";
import { createClient } from "@/lib/supabase/server";

/** GET /api/places — 맛집 목록(최신순). 비로그인 포함 공개. */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("place")
      .select(PLACE_SELECT)
      .order("created_at", { ascending: false })
      .order("created_at", { referencedTable: "place_image", ascending: true });

    if (error) {
      console.error("[place] 목록 조회 실패", { error });
      return NextResponse.json(
        { ok: false, error: "목록을 불러오지 못했습니다" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, places: data.map(toPlaceView) });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/places — 맛집 등록. multipart form-data:
 * `title`(필수) · `content`(필수, 10글자 이상) · `images`(파일 1장 이상).
 * 주소 입력은 다음 단계라 "등록 대기중" 으로 자동 저장한다.
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
    if (!form) {
      return NextResponse.json(
        { ok: false, error: "요청 형식이 올바르지 않습니다" },
        { status: 400 },
      );
    }

    const title = validatePlaceTitle(form.get("title"));
    if (!title.ok) {
      return NextResponse.json(
        { ok: false, error: title.message },
        { status: 400 },
      );
    }

    const content = validatePlaceContent(form.get("content"));
    if (!content.ok) {
      return NextResponse.json(
        { ok: false, error: content.message },
        { status: 400 },
      );
    }

    const files = form
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const images = validatePlaceImages(files);
    if (!images.ok) {
      return NextResponse.json(
        { ok: false, error: images.message },
        { status: 400 },
      );
    }

    const paths = await uploadPlaceImages(supabase, userId, files);
    if (!paths) {
      return NextResponse.json(
        { ok: false, error: "이미지 업로드에 실패했습니다" },
        { status: 500 },
      );
    }

    const { data: placeRow, error: placeError } = await supabase
      .from("place")
      .insert({
        title: title.value,
        content: content.value,
        address: PLACE_ADDRESS_PENDING,
        user_id: userId,
      })
      .select("id")
      .single();

    if (placeError || !placeRow) {
      // 글이 안 만들어졌으면 방금 올린 파일을 지워 고아를 만들지 않는다.
      await removePlaceImages(supabase, paths);
      console.error("[place] 등록 실패", { userId, placeError });
      return NextResponse.json(
        { ok: false, error: "맛집 등록에 실패했습니다" },
        { status: 500 },
      );
    }

    const { error: imageError } = await supabase
      .from("place_image")
      .insert(paths.map((path) => ({ place_id: placeRow.id, image_path: path })));

    if (imageError) {
      // 이미지 없는 글을 남기지 않는다. 글부터 지우고 파일을 정리한다.
      await supabase.from("place").delete().eq("id", placeRow.id);
      await removePlaceImages(supabase, paths);
      console.error("[place] 이미지 경로 저장 실패", { userId, imageError });
      return NextResponse.json(
        { ok: false, error: "맛집 등록에 실패했습니다" },
        { status: 500 },
      );
    }

    const created = await getPlaceRow(supabase, placeRow.id);
    return NextResponse.json(
      { ok: true, place: created ? toPlaceView(created) : null },
      { status: 201 },
    );
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
