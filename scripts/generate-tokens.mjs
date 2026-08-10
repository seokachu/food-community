/**
 * Pencil(.pen) 디자인 토큰 -> 코드 핸드오프 생성기
 *
 * 입력: src/tokens/pencil-tokens.json  (design.pen 의 GetVariables() 미러)
 *       src/tokens/type-scale.json     (타이포 구조 -> 프리미티브 토큰 매핑)
 * 출력: src/tokens/generated.ts        (스토리/컴포넌트가 쓰는 타입 있는 토큰)
 *       src/app/tokens.css             (Tailwind v4 @theme)
 *
 * design.pen 이 바뀌면 pencil-tokens.json 을 갱신하고 `npm run tokens` 를 다시 실행한다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));

const tokens = read("src/tokens/pencil-tokens.json");
const typeScale = read("src/tokens/type-scale.json");

const isRef = (v) => typeof v === "string" && v.startsWith("$");
const deref = (v, seen = new Set()) => {
  if (!isRef(v)) return v;
  const key = v.slice(1);
  if (seen.has(key)) throw new Error(`순환 참조: ${key}`);
  seen.add(key);
  if (!(key in tokens)) throw new Error(`정의되지 않은 토큰 참조: ${key}`);
  return deref(tokens[key], seen);
};

const entries = Object.entries(tokens);
const colorEntries = entries.filter(([k]) => k.startsWith("color-"));

// 프리미티브 = 리터럴 hex, 시맨틱 = 다른 토큰 참조
const primitives = colorEntries.filter(([, v]) => !isRef(v));
const semantics = colorEntries.filter(([, v]) => isRef(v));

const PALETTE_ORDER = ["brand", "neutral", "amber", "green", "blue", "red"];
const SEMANTIC_ORDER = ["text", "background", "border", "icon", "shadow"];

const paletteOf = (t) => t.replace(/^color-/, "").replace(/-\d+$/, "");
const groupOf = (t) => t.replace(/^color-/, "").split("-")[0];

const palettes = PALETTE_ORDER.map((name) => ({
  name,
  tokens: primitives
    .filter(([k]) => paletteOf(k) === name)
    .map(([token, value]) => ({ token, step: token.split("-").pop(), value })),
})).filter((p) => p.tokens.length > 0);

const alphaTokens = primitives
  .filter(([k]) => k.startsWith("color-alpha-"))
  .map(([token, value]) => ({ token, value }));

const semanticGroups = SEMANTIC_ORDER.map((group) => ({
  group,
  tokens: semantics
    .filter(([k]) => groupOf(k) === group)
    .map(([token, ref]) => ({ token, ref: ref.slice(1), value: deref(ref) })),
})).filter((g) => g.tokens.length > 0);

// 누락 검증: 위 그룹 분류에서 빠진 컬러 토큰이 없어야 한다
const covered = new Set([
  ...palettes.flatMap((p) => p.tokens.map((t) => t.token)),
  ...alphaTokens.map((t) => t.token),
  ...semanticGroups.flatMap((g) => g.tokens.map((t) => t.token)),
]);
const missed = colorEntries.map(([k]) => k).filter((k) => !covered.has(k));
if (missed.length) throw new Error(`분류되지 않은 컬러 토큰: ${missed.join(", ")}`);

const fontSizes = entries
  .filter(([k]) => /^font-size-\d+$/.test(k))
  .map(([token, value]) => ({ token, step: token.split("-").pop(), value }))
  .sort((a, b) => b.value - a.value);

const spacing = entries
  .filter(([k]) => k.startsWith("spacing-"))
  .map(([token, value]) => ({ token, value }))
  .sort((a, b) => a.value - b.value);

const LETTER_SPACING = -0.02; // design.pen 의 모든 타이포 컴포넌트 공통 자간 (-2%)

const typography = Object.entries(typeScale).map(([name, spec]) => ({
  name,
  fontSize: tokens[spec.fontSize],
  fontWeight: Number(tokens[spec.fontWeight]),
  lineHeight: tokens[spec.lineHeight],
  letterSpacing: LETTER_SPACING,
  refs: spec,
}));

for (const t of typography) {
  if (!t.fontSize || !t.fontWeight || !t.lineHeight) {
    throw new Error(`타이포 토큰 해석 실패: ${t.name}`);
  }
}

/* ---------------------------------- CSS ---------------------------------- */

const cssVar = (token, value) => `  --${token}: ${value};`;

const css = `/* 이 파일은 scripts/generate-tokens.mjs 가 생성합니다. 직접 수정하지 마세요. */

@theme {
  --font-sans: "${tokens["font-family"]}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* 프리미티브 · 컬러 팔레트 */
${palettes.flatMap((p) => p.tokens.map((t) => cssVar(t.token, t.value))).join("\n")}

  /* 프리미티브 · 알파 */
${alphaTokens.map((t) => cssVar(t.token, t.value)).join("\n")}

  /* 시맨틱 · 컬러 (프리미티브 참조) */
${semanticGroups
  .flatMap((g) => g.tokens.map((t) => cssVar(t.token, `var(--${t.ref})`)))
  .join("\n")}

  /* 프리미티브 · 폰트 사이즈 */
${fontSizes.map((f) => cssVar(`text-${f.step}`, `${f.value}px`)).join("\n")}

  /* 프리미티브 · 폰트 웨이트 */
${entries
  .filter(([k]) => k.startsWith("font-weight-"))
  .map(([k, v]) => cssVar(k, v))
  .join("\n")}

  /* 프리미티브 · 행간 */
${entries
  .filter(([k]) => k.startsWith("font-line-height-"))
  .map(([k, v]) => cssVar(k.replace("font-line-height-", "leading-"), v))
  .join("\n")}

  /* 시맨틱 · 타입 스케일 (text-<name> 유틸리티 1개로 4속성 적용) */
${typography
  .map((t) =>
    [
      cssVar(`text-${t.name}`, `${t.fontSize}px`),
      cssVar(`text-${t.name}--line-height`, t.lineHeight),
      cssVar(`text-${t.name}--font-weight`, t.fontWeight),
      cssVar(`text-${t.name}--letter-spacing`, `${t.letterSpacing}em`),
    ].join("\n"),
  )
  .join("\n")}
}

/*
 * 스페이싱은 Tailwind 의 --spacing-* 네임스페이스를 의도적으로 쓰지 않는다.
 * 디자인 토큰 spacing-8 은 8px 이지만 Tailwind 기본 p-8 은 32px 이라,
 * 같은 이름이 다른 값을 갖게 되어 조용히 깨진다. 별도 --ds-spacing-* 로 노출한다.
 */
:root {
${spacing.map((s) => cssVar(`ds-${s.token}`, `${s.value}px`)).join("\n")}
}
`;

/* ----------------------------------- TS ----------------------------------- */

const j = (v) => JSON.stringify(v, null, 2);

const ts = `/* 이 파일은 scripts/generate-tokens.mjs 가 생성합니다. 직접 수정하지 마세요. */

export type ColorToken = { token: string; value: string };
export type PaletteStep = ColorToken & { step: string };
export type SemanticColor = ColorToken & { ref: string };

/** 프리미티브 컬러 팔레트 (design.pen variables) */
export const palettes: { name: string; tokens: PaletteStep[] }[] = ${j(palettes)};

/** 프리미티브 알파 컬러 */
export const alphaColors: ColorToken[] = ${j(alphaTokens)};

/** 시맨틱 컬러 — value 는 참조를 해석한 최종 hex (대비 계산용) */
export const semanticColorGroups: { group: string; tokens: SemanticColor[] }[] = ${j(semanticGroups)};

/** 프리미티브 폰트 사이즈 (내림차순) */
export const fontSizes: { token: string; step: string; value: number }[] = ${j(fontSizes)};

export type TypeScaleName = ${typography.map((t) => `"${t.name}"`).join(" | ")};

/** 시맨틱 타입 스케일 */
export const typeScale: {
  name: TypeScaleName;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  refs: { fontSize: string; fontWeight: string; lineHeight: string };
}[] = ${j(typography)};

/** 스페이싱 토큰 */
export const spacing: { token: string; value: number }[] = ${j(spacing)};

export const fontFamily = ${j(tokens["font-family"])};
`;

writeFileSync(resolve(root, "src/app/tokens.css"), css);
writeFileSync(resolve(root, "src/tokens/generated.ts"), ts);

console.log(
  `생성 완료: 팔레트 ${palettes.length}종 / 프리미티브 ${primitives.length}개 / 시맨틱 ${semantics.length}개 / 타입 스케일 ${typography.length}개 / 스페이싱 ${spacing.length}개`,
);
