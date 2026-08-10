/** WCAG 2.1 명도 대비 계산. 컬러 파운데이션 문서에서 AA 충족 단계를 표시하는 데 쓴다. */

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** #RGB / #RRGGBB / #RRGGBBAA 를 받는다. 알파는 대비 계산에서 무시된다. */
export function relativeLuminance(hex: string): number {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.length !== 6 && h.length !== 8) {
    throw new Error(`잘못된 hex 색상: ${hex}`);
  }
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (
    0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
  );
}

export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastGrade = "AAA" | "AA" | "AA Large" | "Fail";

/** 일반 텍스트 기준 등급. 3:1 은 큰 텍스트/그래픽 요소 최소치. */
export function grade(ratio: number): ContrastGrade {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export const formatRatio = (ratio: number) => `${ratio.toFixed(2)}:1`;
