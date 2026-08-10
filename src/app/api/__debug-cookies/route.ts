import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 임시 진단용 라우트. PKCE 검증자 쿠키 저장 여부 확인 후 삭제한다.
export async function GET() {
  const store = await cookies();
  return NextResponse.json({
    names: store.getAll().map((c) => c.name),
  });
}
