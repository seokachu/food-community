import type { IconName } from "@/components/foundation/Icon";

/**
 * 서비스 전역 내비게이션 항목.
 *
 * 모바일 바텀내비게이션과 태블릿·데스크톱 헤더가 같은 배열을 읽는다.
 * 라우트를 추가할 때 여기 한 곳만 고치면 두 내비게이션이 함께 따라간다.
 */
export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/explore", label: "둘러보기", icon: "search" },
  { href: "/register", label: "등록", icon: "plus" },
  { href: "/my", label: "MY", icon: "user" },
];

/** `/` 는 완전 일치, 나머지는 하위 경로까지 활성으로 본다. */
export function isNavItemActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
