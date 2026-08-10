/**
 * 클래스명을 합친다. falsy 값은 버린다.
 *
 * tailwind-merge 는 쓰지 않는다. 이 저장소의 컴포넌트는 충돌 가능한 유틸리티를
 * 미리 분기해서 만들고, className 은 항상 마지막에 이어 붙여 호출측이 이기게 한다.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
