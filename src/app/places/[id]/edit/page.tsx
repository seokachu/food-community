import { notFound, redirect } from "next/navigation";

import { PlaceForm } from "@/app/register/PlaceForm";
import { parsePlaceId } from "@/lib/place-rules";
import { getPlaceRow, toPlaceView } from "@/lib/place/service";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "맛집 수정 · 숨은맛집",
  description: "내가 소개한 숨은 맛집 이야기를 고칩니다.",
};

/**
 * 맛집 수정 화면. 등록 폼(PlaceForm)을 수정 모드로 연다.
 * 본인이 쓴 글만 열 수 있게 서버에서 걸러내고, BFF PATCH 가 403 으로 한 번 더 막는다.
 */
export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parsePlaceId(rawId);
  if (id === null) notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) {
    // 로그인 후 수정 화면으로 되돌아온다.
    redirect(`/login?next=/places/${id}/edit`);
  }

  const row = await getPlaceRow(supabase, id);
  if (!row) notFound();
  // 남의 글은 수정 화면 대신 상세로 보낸다.
  if (row.user_id !== claims.sub) redirect(`/places/${id}`);

  const place = toPlaceView(row);
  return (
    <PlaceForm
      naverMapClientId={process.env.NAVER_MAP_CLIENT_ID ?? ""}
      initial={{
        id: place.id,
        title: place.title,
        content: place.content,
        // 지도 연동 전에 등록된 옛 글은 지도 정보가 비어 있어 다시 골라야 저장된다.
        place:
          place.name && place.lat !== null && place.lng !== null
            ? {
                name: place.name,
                address: place.address,
                position: { lat: place.lat, lng: place.lng },
              }
            : null,
        images: place.images,
      }}
    />
  );
}
