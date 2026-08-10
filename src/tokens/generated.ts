/* 이 파일은 scripts/generate-tokens.mjs 가 생성합니다. 직접 수정하지 마세요. */

export type ColorToken = { token: string; value: string };
export type PaletteStep = ColorToken & { step: string };
export type SemanticColor = ColorToken & { ref: string };

/** 프리미티브 컬러 팔레트 (design.pen variables) */
export const palettes: { name: string; tokens: PaletteStep[] }[] = [
  {
    "name": "brand",
    "tokens": [
      {
        "token": "color-brand-50",
        "step": "50",
        "value": "#ECFDF8"
      },
      {
        "token": "color-brand-100",
        "step": "100",
        "value": "#D1FAEC"
      },
      {
        "token": "color-brand-200",
        "step": "200",
        "value": "#A7F3DB"
      },
      {
        "token": "color-brand-300",
        "step": "300",
        "value": "#6EE7C5"
      },
      {
        "token": "color-brand-400",
        "step": "400",
        "value": "#34D4AA"
      },
      {
        "token": "color-brand-500",
        "step": "500",
        "value": "#10C79B"
      },
      {
        "token": "color-brand-600",
        "step": "600",
        "value": "#0A9675"
      },
      {
        "token": "color-brand-700",
        "step": "700",
        "value": "#087761"
      },
      {
        "token": "color-brand-800",
        "step": "800",
        "value": "#095E4E"
      },
      {
        "token": "color-brand-900",
        "step": "900",
        "value": "#084E42"
      },
      {
        "token": "color-brand-950",
        "step": "950",
        "value": "#022D27"
      }
    ]
  },
  {
    "name": "neutral",
    "tokens": [
      {
        "token": "color-neutral-50",
        "step": "50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-neutral-100",
        "step": "100",
        "value": "#F3F5F6"
      },
      {
        "token": "color-neutral-200",
        "step": "200",
        "value": "#E5E9EA"
      },
      {
        "token": "color-neutral-300",
        "step": "300",
        "value": "#D1D8DA"
      },
      {
        "token": "color-neutral-400",
        "step": "400",
        "value": "#9AA9AE"
      },
      {
        "token": "color-neutral-500",
        "step": "500",
        "value": "#75858B"
      },
      {
        "token": "color-neutral-600",
        "step": "600",
        "value": "#5F6C71"
      },
      {
        "token": "color-neutral-700",
        "step": "700",
        "value": "#424C50"
      },
      {
        "token": "color-neutral-800",
        "step": "800",
        "value": "#293033"
      },
      {
        "token": "color-neutral-900",
        "step": "900",
        "value": "#171C1E"
      },
      {
        "token": "color-neutral-950",
        "step": "950",
        "value": "#0B0F10"
      }
    ]
  },
  {
    "name": "amber",
    "tokens": [
      {
        "token": "color-amber-50",
        "step": "50",
        "value": "#FFFBEB"
      },
      {
        "token": "color-amber-100",
        "step": "100",
        "value": "#FEF3C7"
      },
      {
        "token": "color-amber-200",
        "step": "200",
        "value": "#FDE68A"
      },
      {
        "token": "color-amber-300",
        "step": "300",
        "value": "#FCD34D"
      },
      {
        "token": "color-amber-400",
        "step": "400",
        "value": "#FBBF24"
      },
      {
        "token": "color-amber-500",
        "step": "500",
        "value": "#F59E0B"
      },
      {
        "token": "color-amber-600",
        "step": "600",
        "value": "#D97706"
      },
      {
        "token": "color-amber-700",
        "step": "700",
        "value": "#B45309"
      },
      {
        "token": "color-amber-800",
        "step": "800",
        "value": "#92400E"
      },
      {
        "token": "color-amber-900",
        "step": "900",
        "value": "#78350F"
      },
      {
        "token": "color-amber-950",
        "step": "950",
        "value": "#451A03"
      }
    ]
  },
  {
    "name": "green",
    "tokens": [
      {
        "token": "color-green-50",
        "step": "50",
        "value": "#F0FDF4"
      },
      {
        "token": "color-green-100",
        "step": "100",
        "value": "#DCFCE7"
      },
      {
        "token": "color-green-200",
        "step": "200",
        "value": "#BBF7D0"
      },
      {
        "token": "color-green-300",
        "step": "300",
        "value": "#86EFAC"
      },
      {
        "token": "color-green-400",
        "step": "400",
        "value": "#4ADE80"
      },
      {
        "token": "color-green-500",
        "step": "500",
        "value": "#22C55E"
      },
      {
        "token": "color-green-600",
        "step": "600",
        "value": "#16A34A"
      },
      {
        "token": "color-green-700",
        "step": "700",
        "value": "#15803D"
      },
      {
        "token": "color-green-800",
        "step": "800",
        "value": "#166534"
      },
      {
        "token": "color-green-900",
        "step": "900",
        "value": "#14532D"
      },
      {
        "token": "color-green-950",
        "step": "950",
        "value": "#052E16"
      }
    ]
  },
  {
    "name": "blue",
    "tokens": [
      {
        "token": "color-blue-50",
        "step": "50",
        "value": "#EFF6FF"
      },
      {
        "token": "color-blue-100",
        "step": "100",
        "value": "#DBEAFE"
      },
      {
        "token": "color-blue-200",
        "step": "200",
        "value": "#BFDBFE"
      },
      {
        "token": "color-blue-300",
        "step": "300",
        "value": "#93C5FD"
      },
      {
        "token": "color-blue-400",
        "step": "400",
        "value": "#60A5FA"
      },
      {
        "token": "color-blue-500",
        "step": "500",
        "value": "#3B82F6"
      },
      {
        "token": "color-blue-600",
        "step": "600",
        "value": "#2563EB"
      },
      {
        "token": "color-blue-700",
        "step": "700",
        "value": "#1D4ED8"
      },
      {
        "token": "color-blue-800",
        "step": "800",
        "value": "#1E40AF"
      },
      {
        "token": "color-blue-900",
        "step": "900",
        "value": "#1E3A8A"
      },
      {
        "token": "color-blue-950",
        "step": "950",
        "value": "#172554"
      }
    ]
  },
  {
    "name": "red",
    "tokens": [
      {
        "token": "color-red-50",
        "step": "50",
        "value": "#FEF2F2"
      },
      {
        "token": "color-red-100",
        "step": "100",
        "value": "#FEE2E2"
      },
      {
        "token": "color-red-200",
        "step": "200",
        "value": "#FECACA"
      },
      {
        "token": "color-red-300",
        "step": "300",
        "value": "#FCA5A5"
      },
      {
        "token": "color-red-400",
        "step": "400",
        "value": "#F87171"
      },
      {
        "token": "color-red-500",
        "step": "500",
        "value": "#EF6257"
      },
      {
        "token": "color-red-600",
        "step": "600",
        "value": "#D94B3D"
      },
      {
        "token": "color-red-700",
        "step": "700",
        "value": "#B9362D"
      },
      {
        "token": "color-red-800",
        "step": "800",
        "value": "#982E28"
      },
      {
        "token": "color-red-900",
        "step": "900",
        "value": "#7F2A26"
      },
      {
        "token": "color-red-950",
        "step": "950",
        "value": "#451411"
      }
    ]
  }
];

/** 프리미티브 알파 컬러 */
export const alphaColors: ColorToken[] = [
  {
    "token": "color-alpha-white-0",
    "value": "#FFFFFF00"
  },
  {
    "token": "color-alpha-white-92",
    "value": "#FFFFFFEB"
  },
  {
    "token": "color-alpha-neutral-950-4",
    "value": "#0B0F100A"
  },
  {
    "token": "color-alpha-neutral-950-10",
    "value": "#0B0F1018"
  },
  {
    "token": "color-alpha-neutral-950-13",
    "value": "#0B0F1022"
  },
  {
    "token": "color-alpha-neutral-950-80",
    "value": "#0B0F10CC"
  },
  {
    "token": "color-alpha-brand-900-13",
    "value": "#084E4222"
  }
];

/** 시맨틱 컬러 — value 는 참조를 해석한 최종 hex (대비 계산용) */
export const semanticColorGroups: { group: string; tokens: SemanticColor[] }[] = [
  {
    "group": "text",
    "tokens": [
      {
        "token": "color-text-default",
        "ref": "color-neutral-900",
        "value": "#171C1E"
      },
      {
        "token": "color-text-secondary",
        "ref": "color-neutral-700",
        "value": "#424C50"
      },
      {
        "token": "color-text-muted",
        "ref": "color-neutral-600",
        "value": "#5F6C71"
      },
      {
        "token": "color-text-label",
        "ref": "color-neutral-600",
        "value": "#5F6C71"
      },
      {
        "token": "color-text-brand",
        "ref": "color-brand-700",
        "value": "#087761"
      },
      {
        "token": "color-text-on-brand",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-text-on-inverse",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-text-on-inverse-secondary",
        "ref": "color-neutral-300",
        "value": "#D1D8DA"
      },
      {
        "token": "color-text-on-disabled",
        "ref": "color-neutral-700",
        "value": "#424C50"
      },
      {
        "token": "color-text-warning",
        "ref": "color-amber-800",
        "value": "#92400E"
      },
      {
        "token": "color-text-success",
        "ref": "color-green-700",
        "value": "#15803D"
      },
      {
        "token": "color-text-info",
        "ref": "color-blue-700",
        "value": "#1D4ED8"
      },
      {
        "token": "color-text-error",
        "ref": "color-red-700",
        "value": "#B9362D"
      },
      {
        "token": "color-text-error-strong",
        "ref": "color-red-800",
        "value": "#982E28"
      }
    ]
  },
  {
    "group": "background",
    "tokens": [
      {
        "token": "color-background-default",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-background-subtle",
        "ref": "color-neutral-100",
        "value": "#F3F5F6"
      },
      {
        "token": "color-background-elevated",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-background-inverse",
        "ref": "color-neutral-900",
        "value": "#171C1E"
      },
      {
        "token": "color-background-brand",
        "ref": "color-brand-700",
        "value": "#087761"
      },
      {
        "token": "color-background-brand-subtle",
        "ref": "color-brand-50",
        "value": "#ECFDF8"
      },
      {
        "token": "color-background-brand-soft",
        "ref": "color-brand-100",
        "value": "#D1FAEC"
      },
      {
        "token": "color-background-neutral-soft",
        "ref": "color-neutral-200",
        "value": "#E5E9EA"
      },
      {
        "token": "color-background-disabled",
        "ref": "color-neutral-300",
        "value": "#D1D8DA"
      },
      {
        "token": "color-background-transparent",
        "ref": "color-alpha-white-0",
        "value": "#FFFFFF00"
      },
      {
        "token": "color-background-glass",
        "ref": "color-alpha-white-92",
        "value": "#FFFFFFEB"
      },
      {
        "token": "color-background-overlay",
        "ref": "color-alpha-neutral-950-80",
        "value": "#0B0F10CC"
      },
      {
        "token": "color-background-map",
        "ref": "color-brand-50",
        "value": "#ECFDF8"
      },
      {
        "token": "color-background-map-accent",
        "ref": "color-brand-100",
        "value": "#D1FAEC"
      },
      {
        "token": "color-background-map-road",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-background-warning-subtle",
        "ref": "color-amber-50",
        "value": "#FFFBEB"
      },
      {
        "token": "color-background-success-subtle",
        "ref": "color-green-50",
        "value": "#F0FDF4"
      },
      {
        "token": "color-background-info-subtle",
        "ref": "color-blue-50",
        "value": "#EFF6FF"
      },
      {
        "token": "color-background-error",
        "ref": "color-red-700",
        "value": "#B9362D"
      },
      {
        "token": "color-background-error-subtle",
        "ref": "color-red-50",
        "value": "#FEF2F2"
      }
    ]
  },
  {
    "group": "border",
    "tokens": [
      {
        "token": "color-border-default",
        "ref": "color-neutral-300",
        "value": "#D1D8DA"
      },
      {
        "token": "color-border-subtle",
        "ref": "color-neutral-200",
        "value": "#E5E9EA"
      },
      {
        "token": "color-border-strong",
        "ref": "color-neutral-500",
        "value": "#75858B"
      },
      {
        "token": "color-border-brand",
        "ref": "color-brand-600",
        "value": "#0A9675"
      },
      {
        "token": "color-border-warning",
        "ref": "color-amber-600",
        "value": "#D97706"
      },
      {
        "token": "color-border-success",
        "ref": "color-green-600",
        "value": "#16A34A"
      },
      {
        "token": "color-border-info",
        "ref": "color-blue-600",
        "value": "#2563EB"
      },
      {
        "token": "color-border-error",
        "ref": "color-red-600",
        "value": "#D94B3D"
      }
    ]
  },
  {
    "group": "icon",
    "tokens": [
      {
        "token": "color-icon-default",
        "ref": "color-neutral-900",
        "value": "#171C1E"
      },
      {
        "token": "color-icon-secondary",
        "ref": "color-neutral-700",
        "value": "#424C50"
      },
      {
        "token": "color-icon-muted",
        "ref": "color-neutral-500",
        "value": "#75858B"
      },
      {
        "token": "color-icon-brand",
        "ref": "color-brand-700",
        "value": "#087761"
      },
      {
        "token": "color-icon-on-brand",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-icon-on-inverse",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-icon-on-error",
        "ref": "color-neutral-50",
        "value": "#FAFCFC"
      },
      {
        "token": "color-icon-on-disabled",
        "ref": "color-neutral-700",
        "value": "#424C50"
      },
      {
        "token": "color-icon-warning",
        "ref": "color-amber-700",
        "value": "#B45309"
      },
      {
        "token": "color-icon-success",
        "ref": "color-green-700",
        "value": "#15803D"
      },
      {
        "token": "color-icon-info",
        "ref": "color-blue-700",
        "value": "#1D4ED8"
      },
      {
        "token": "color-icon-error",
        "ref": "color-red-700",
        "value": "#B9362D"
      }
    ]
  },
  {
    "group": "shadow",
    "tokens": [
      {
        "token": "color-shadow-subtle",
        "ref": "color-alpha-neutral-950-4",
        "value": "#0B0F100A"
      },
      {
        "token": "color-shadow-medium",
        "ref": "color-alpha-neutral-950-10",
        "value": "#0B0F1018"
      },
      {
        "token": "color-shadow-strong",
        "ref": "color-alpha-neutral-950-13",
        "value": "#0B0F1022"
      },
      {
        "token": "color-shadow-brand",
        "ref": "color-alpha-brand-900-13",
        "value": "#084E4222"
      }
    ]
  }
];

/** 프리미티브 폰트 사이즈 (내림차순) */
export const fontSizes: { token: string; step: string; value: number }[] = [
  {
    "token": "font-size-900",
    "step": "900",
    "value": 40
  },
  {
    "token": "font-size-800",
    "step": "800",
    "value": 36
  },
  {
    "token": "font-size-700",
    "step": "700",
    "value": 32
  },
  {
    "token": "font-size-600",
    "step": "600",
    "value": 28
  },
  {
    "token": "font-size-500",
    "step": "500",
    "value": 24
  },
  {
    "token": "font-size-400",
    "step": "400",
    "value": 20
  },
  {
    "token": "font-size-300",
    "step": "300",
    "value": 16
  },
  {
    "token": "font-size-200",
    "step": "200",
    "value": 14
  },
  {
    "token": "font-size-100",
    "step": "100",
    "value": 12
  }
];

export type TypeScaleName = "display-lg" | "display-md" | "display-sm" | "heading-lg" | "heading-md" | "heading-sm" | "body-lg" | "body-md" | "label-lg" | "label-md";

/** 시맨틱 타입 스케일 */
export const typeScale: {
  name: TypeScaleName;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  refs: { fontSize: string; fontWeight: string; lineHeight: string };
}[] = [
  {
    "name": "display-lg",
    "fontSize": 36,
    "fontWeight": 700,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-800",
      "fontWeight": "font-weight-bold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "display-md",
    "fontSize": 32,
    "fontWeight": 700,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-700",
      "fontWeight": "font-weight-bold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "display-sm",
    "fontSize": 28,
    "fontWeight": 700,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-600",
      "fontWeight": "font-weight-bold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "heading-lg",
    "fontSize": 24,
    "fontWeight": 700,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-500",
      "fontWeight": "font-weight-bold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "heading-md",
    "fontSize": 20,
    "fontWeight": 700,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-400",
      "fontWeight": "font-weight-bold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "heading-sm",
    "fontSize": 16,
    "fontWeight": 600,
    "lineHeight": 1.2,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-300",
      "fontWeight": "font-weight-semibold",
      "lineHeight": "font-line-height-tight"
    }
  },
  {
    "name": "body-lg",
    "fontSize": 16,
    "fontWeight": 400,
    "lineHeight": 1.4,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-300",
      "fontWeight": "font-weight-regular",
      "lineHeight": "font-line-height-normal"
    }
  },
  {
    "name": "body-md",
    "fontSize": 14,
    "fontWeight": 400,
    "lineHeight": 1.4,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-200",
      "fontWeight": "font-weight-regular",
      "lineHeight": "font-line-height-normal"
    }
  },
  {
    "name": "label-lg",
    "fontSize": 14,
    "fontWeight": 600,
    "lineHeight": 1.4,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-200",
      "fontWeight": "font-weight-semibold",
      "lineHeight": "font-line-height-normal"
    }
  },
  {
    "name": "label-md",
    "fontSize": 12,
    "fontWeight": 400,
    "lineHeight": 1.4,
    "letterSpacing": -0.02,
    "refs": {
      "fontSize": "font-size-100",
      "fontWeight": "font-weight-regular",
      "lineHeight": "font-line-height-normal"
    }
  }
];

/** 스페이싱 토큰 */
export const spacing: { token: string; value: number }[] = [
  {
    "token": "spacing-8",
    "value": 8
  },
  {
    "token": "spacing-12",
    "value": 12
  },
  {
    "token": "spacing-16",
    "value": 16
  },
  {
    "token": "spacing-20",
    "value": 20
  },
  {
    "token": "spacing-24",
    "value": 24
  },
  {
    "token": "spacing-32",
    "value": 32
  }
];

export const fontFamily = "Pretendard Variable";
