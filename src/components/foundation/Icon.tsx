import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Bell,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleX,
  Copy,
  Ellipsis,
  EllipsisVertical,
  Funnel,
  Heart,
  House,
  Image as ImageIcon,
  Info,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  TriangleAlert,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * design.pen 의 `Icon/<name>/<size>` 컴포넌트 144개(36종 x 4사이즈)에 대응한다.
 * 키는 디자인 시스템의 시맨틱 이름, 값은 그 이름이 실제로 렌더하는 lucide 아이콘이다.
 * 둘은 일치하지 않는 경우가 많다 (close -> x, delete -> trash-2, error -> circle-x ...).
 * map-pin 은 시안에 없지만 네이버 지도 연동(중심 고정 핀)을 위해 코드에서 추가했다.
 */
export const iconMap = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  home: House,
  calendar: Calendar,
  copy: Copy,
  refresh: RefreshCw,
  logout: LogOut,
  close: X,
  menu: Menu,
  search: Search,
  filter: Funnel,
  sort: ArrowUpDown,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  bookmark: Bookmark,
  share: Share2,
  "more-horizontal": Ellipsis,
  "more-vertical": EllipsisVertical,
  check: Check,
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  user: User,
  settings: Settings,
  notification: Bell,
  heart: Heart,
  star: Star,
  comment: MessageCircle,
  image: ImageIcon,
  "map-pin": MapPin,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export const iconNames = Object.keys(iconMap) as IconName[];

/** design.pen 이 컴포넌트로 만들어 둔 4가지 사이즈 */
export const ICON_SIZES = [16, 20, 24, 32] as const;
export type IconSize = (typeof ICON_SIZES)[number];

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  name: IconName;
  /**
   * 기본은 design.pen 이 컴포넌트로 만들어 둔 4가지 사이즈다.
   * 다른 숫자도 받지만, 시안이 실제로 그 크기를 쓰는 경우에만 사용한다
   * (예: 마이페이지 프로필 아바타 안의 40px 사용자 아이콘).
   */
  size?: IconSize | (number & {});
  /** 장식용 아이콘이면 생략한다. 값이 있으면 img 로 노출된다. */
  label?: string;
}

/**
 * 색은 currentColor 를 따른다. 기본값은 시맨틱 토큰 color-icon-default 이며
 * `className="text-icon-brand"` 처럼 시맨틱 토큰으로 덮어쓴다.
 */
export function Icon({
  name,
  size = 24,
  label,
  className,
  ...props
}: IconProps) {
  const LucideGlyph = iconMap[name];

  return (
    <LucideGlyph
      width={size}
      height={size}
      strokeWidth={2}
      className={className ?? "text-icon-default"}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      {...props}
    />
  );
}
