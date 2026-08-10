import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 정적 리소스를 제외한 모든 경로에서 세션을 갱신한다:
     * - _next/static, _next/image, favicon.ico
     * - public/fonts, public/images 및 이미지·폰트 파일
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
