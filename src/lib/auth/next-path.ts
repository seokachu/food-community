import "server-only";

/**
 * 로그인 후 돌아갈 경로로 같은 출처의 경로만 허용한다. `//evil.com` 이나
 * `/\evil.com` 은 브라우저가 프로토콜 상대 URL 로 읽을 수 있어
 * 단순히 "/" 로 시작하는지만 봐서는 부족하다.
 */
export function safeNextPath(raw: unknown) {
  if (typeof raw !== "string" || !raw.startsWith("/")) return "/";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}
