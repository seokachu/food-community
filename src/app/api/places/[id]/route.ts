import { NextResponse } from "next/server";

import {
  parsePlaceId,
  PLACE_IMAGE_MIN_COUNT,
  validatePlaceContent,
  validatePlaceImages,
  validatePlaceLocation,
  validatePlaceTitle,
} from "@/lib/place-rules";
import {
  getPlaceRow,
  removePlaceImages,
  toPlaceView,
  uploadPlaceImages,
} from "@/lib/place/service";
import { createClient } from "@/lib/supabase/server";

/** GET /api/places/[id] — 맛집 상세. 비로그인 포함 공개. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = parsePlaceId(rawId);
    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "잘못된 맛집 주소입니다" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const row = await getPlaceRow(supabase, id);
    if (!row) {
      return NextResponse.json(
        { ok: false, error: "맛집을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, place: toPlaceView(row) });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/places/[id] — 맛집 수정. multipart form-data:
 * `title`(필수) · `content`(필수, 10글자 이상) ·
 * `name`·`address`·`lat`·`lng`(지도 정보, 모두 필수 — 하나라도 없으면 400) ·
 * `images`(추가할 파일, 선택) · `removeImageIds`(지울 place_image.id, 선택·반복)
 * 수정 후에도 이미지는 1장 이상 남아 있어야 한다.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id: rawId } = await params;
    const id = parsePlaceId(rawId);
    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "잘못된 맛집 주소입니다" },
        { status: 400 },
      );
    }

    const existing = await getPlaceRow(supabase, id);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "맛집을 찾을 수 없습니다" },
        { status: 404 },
      );
    }
    // RLS 가 어차피 막지만, 그때는 0행 갱신으로 조용히 끝나므로 여기서 상태코드를 준다.
    if (existing.user_id !== userId) {
      return NextResponse.json(
        { ok: false, error: "본인이 등록한 맛집만 수정할 수 있습니다" },
        { status: 403 },
      );
    }

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

    const location = validatePlaceLocation({
      name: form.get("name"),
      address: form.get("address"),
      lat: form.get("lat"),
      lng: form.get("lng"),
    });
    if (!location.ok) {
      return NextResponse.json(
        { ok: false, error: location.message },
        { status: 400 },
      );
    }

    // 추가분은 개수 하한 없이 형식·용량만 검사한다. 하한은 아래 최종 개수로 판단.
    const newFiles = form
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const images = validatePlaceImages(newFiles, 0);
    if (!images.ok) {
      return NextResponse.json(
        { ok: false, error: images.message },
        { status: 400 },
      );
    }

    const removeIds = form
      .getAll("removeImageIds")
      .filter((entry): entry is string => typeof entry === "string" && !!entry);
    const existingIds = new Set(existing.place_image.map((image) => image.id));
    if (removeIds.some((removeId) => !existingIds.has(removeId))) {
      return NextResponse.json(
        { ok: false, error: "삭제할 이미지를 찾을 수 없습니다" },
        { status: 400 },
      );
    }

    const finalCount =
      existing.place_image.length - removeIds.length + newFiles.length;
    if (finalCount < PLACE_IMAGE_MIN_COUNT) {
      return NextResponse.json(
        { ok: false, error: "이미지는 1장 이상 남아 있어야 해요" },
        { status: 400 },
      );
    }

    const newPaths =
      newFiles.length > 0
        ? await uploadPlaceImages(supabase, userId, newFiles)
        : [];
    if (!newPaths) {
      return NextResponse.json(
        { ok: false, error: "이미지 업로드에 실패했습니다" },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("place")
      .update({
        title: title.value,
        content: content.value,
        address: location.value.address,
        name: location.value.name,
        lat: location.value.lat,
        lng: location.value.lng,
      })
      .eq("id", id);

    if (updateError) {
      await removePlaceImages(supabase, newPaths);
      console.error("[place] 수정 실패", { id, userId, updateError });
      return NextResponse.json(
        { ok: false, error: "맛집 수정에 실패했습니다" },
        { status: 500 },
      );
    }

    if (newPaths.length > 0) {
      const { error: imageError } = await supabase
        .from("place_image")
        .insert(newPaths.map((path) => ({ place_id: id, image_path: path })));

      if (imageError) {
        await removePlaceImages(supabase, newPaths);
        console.error("[place] 이미지 추가 실패", { id, userId, imageError });
        return NextResponse.json(
          { ok: false, error: "이미지 추가에 실패했습니다" },
          { status: 500 },
        );
      }
    }

    if (removeIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("place_image")
        .delete()
        .in("id", removeIds);

      if (deleteError) {
        console.error("[place] 이미지 삭제 실패", { id, userId, deleteError });
        return NextResponse.json(
          { ok: false, error: "이미지 삭제에 실패했습니다" },
          { status: 500 },
        );
      }

      // DB 행이 지워진 뒤에만 파일을 지운다. 실패해도 수정 자체는 성공이라 기록만 남긴다.
      await removePlaceImages(
        supabase,
        existing.place_image
          .filter((image) => removeIds.includes(image.id))
          .map((image) => image.image_path),
      );
    }

    const updated = await getPlaceRow(supabase, id);
    return NextResponse.json({
      ok: true,
      place: updated ? toPlaceView(updated) : null,
    });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/places/[id] — 맛집 소프트삭제. 행을 지우지 않고 deleted_at 만
 * 기록한다. 이후 목록·상세 조회에서 제외되며, 이미지 파일·행도 복구를 위해
 * 그대로 남긴다. 이미 삭제된 글은 404 로 답해 두 번 지워지지 않는다.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id: rawId } = await params;
    const id = parsePlaceId(rawId);
    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "잘못된 맛집 주소입니다" },
        { status: 400 },
      );
    }

    const existing = await getPlaceRow(supabase, id);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "맛집을 찾을 수 없습니다" },
        { status: 404 },
      );
    }
    // RLS 가 어차피 막지만, 그때는 0행 갱신으로 조용히 끝나므로 여기서 상태코드를 준다.
    if (existing.user_id !== userId) {
      return NextResponse.json(
        { ok: false, error: "본인이 등록한 맛집만 삭제할 수 있습니다" },
        { status: 403 },
      );
    }

    const { error: deleteError } = await supabase
      .from("place")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .is("deleted_at", null);

    if (deleteError) {
      console.error("[place] 삭제 실패", { id, userId, deleteError });
      return NextResponse.json(
        { ok: false, error: "맛집 삭제에 실패했습니다" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
