/**
 * public/logo.svg 하나에서 PWA 에셋 전부를 생성한다. (npm run pwa-assets)
 *
 * - public/icons/icon-{192,512}.png        : 설치 아이콘 (라운드 밖 투명)
 * - public/icons/icon-maskable-{192,512}.png : Android maskable (풀블리드 브랜드 배경)
 * - src/app/apple-icon.png                 : iOS 홈 화면 아이콘 (180, 풀블리드 — iOS가 모서리를 깎음)
 * - src/app/favicon.ico                    : 16/32/48 멀티사이즈, 배경 투명 (PNG 엔트리 ICO)
 * - src/app/icon.svg                       : SVG 파비콘 (logo.svg 복사)
 * - public/splash/apple-splash-*.png       : iOS 스플래시 (apple-touch-startup-image)
 * - src/lib/pwa/splash-screens.ts          : 스플래시 <link> 목록 (layout.tsx 가 import)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = path.join(root, "public/logo.svg");

/** logo.svg 의 rect fill 과 같아야 한다. 풀블리드 아이콘의 배경으로 쓴다. */
const BRAND_BG = "#087761"; // --color-background-brand (brand-700)
/** 스플래시 배경. manifest background_color·앱 배경(--color-background-default)과 맞춘다. */
const SPLASH_BG = "#FAFCFC"; // neutral-50

/** logo.svg(viewBox 512)를 원하는 크기의 투명 배경 PNG 버퍼로 렌더한다. */
async function renderLogo(size) {
  return sharp(LOGO, { density: Math.max(72, (72 * size) / 512) })
    .resize(size, size)
    .png()
    .toBuffer();
}

/** 단색 정사각형 위에 로고를 가운데 합성한다. (maskable/apple 아이콘용) */
async function renderFullBleed(size, logoRatio, background) {
  const logo = await renderLogo(Math.round(size * logoRatio));
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toBuffer();
}

/** PNG 버퍼들을 ICO 컨테이너로 묶는다. (Vista+ 형식, 모든 모던 브라우저 지원) */
function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dirs = [];
  let offset = 6 + 16 * entries.length;
  for (const { size, buffer } of entries) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
    dir.writeUInt16LE(1, 4); // color planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(buffer.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    offset += buffer.length;
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.buffer)]);
}

/**
 * iOS 스플래시 대상 기기. CSS 픽셀(세로 모드) + DPR.
 * apple-touch-startup-image 는 기기 해상도와 정확히 일치해야 적용된다.
 */
const SPLASH_DEVICES = [
  // iPhone
  { w: 440, h: 956, dpr: 3 }, // 16 Pro Max
  { w: 430, h: 932, dpr: 3 }, // 14/15 Pro Max, 15/16 Plus
  { w: 402, h: 874, dpr: 3 }, // 16 Pro
  { w: 393, h: 852, dpr: 3 }, // 14/15 Pro, 15/16
  { w: 428, h: 926, dpr: 3 }, // 12/13 Pro Max, 14 Plus
  { w: 390, h: 844, dpr: 3 }, // 12/13/14, 16e
  { w: 414, h: 896, dpr: 3 }, // XS Max, 11 Pro Max
  { w: 414, h: 896, dpr: 2 }, // XR, 11
  { w: 375, h: 812, dpr: 3 }, // X/XS, 11 Pro, 12/13 mini
  { w: 414, h: 736, dpr: 3 }, // 6+/7+/8+
  { w: 375, h: 667, dpr: 2 }, // 6/7/8, SE 2/3
  // iPad
  { w: 1032, h: 1376, dpr: 2 }, // iPad Pro 13" (M4)
  { w: 1024, h: 1366, dpr: 2 }, // iPad Pro 12.9"
  { w: 834, h: 1194, dpr: 2 }, // iPad Pro 11"
  { w: 820, h: 1180, dpr: 2 }, // iPad Air 10.9", iPad 10세대
  { w: 834, h: 1112, dpr: 2 }, // iPad Air 10.5"
  { w: 810, h: 1080, dpr: 2 }, // iPad 10.2"
  { w: 768, h: 1024, dpr: 2 }, // iPad 9.7", mini
];

async function main() {
  const iconsDir = path.join(root, "public/icons");
  const splashDir = path.join(root, "public/splash");
  const appDir = path.join(root, "src/app");
  const pwaLibDir = path.join(root, "src/lib/pwa");
  await Promise.all(
    [iconsDir, splashDir, pwaLibDir].map((d) => mkdir(d, { recursive: true })),
  );

  // 1. 설치 아이콘 (라운드 밖 투명)
  for (const size of [192, 512]) {
    await writeFile(
      path.join(iconsDir, `icon-${size}.png`),
      await renderLogo(size),
    );
  }

  // 2. maskable 아이콘: 풀블리드 배경 + 안전 영역(중앙 80%) 안의 로고
  for (const size of [192, 512]) {
    await writeFile(
      path.join(iconsDir, `icon-maskable-${size}.png`),
      await renderFullBleed(size, 0.8, BRAND_BG),
    );
  }

  // 3. iOS 홈 화면 아이콘: 투명 불가 → 풀블리드
  await writeFile(
    path.join(appDir, "apple-icon.png"),
    await renderFullBleed(180, 0.85, BRAND_BG),
  );

  // 4. 파비콘: 배경 투명 유지 (흰색 배경 금지)
  const icoEntries = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, buffer: await renderLogo(size) })),
  );
  await writeFile(path.join(appDir, "favicon.ico"), packIco(icoEntries));
  await writeFile(path.join(appDir, "icon.svg"), await readFile(LOGO));

  // 5. iOS 스플래시: 앱 배경색 + 중앙 로고(화면 폭의 28%)
  const splashScreens = [];
  for (const { w, h, dpr } of SPLASH_DEVICES) {
    const px = { w: w * dpr, h: h * dpr };
    const file = `apple-splash-${px.w}x${px.h}.png`;
    const logoSize = Math.round(px.w * 0.28);
    const logo = await renderLogo(logoSize);
    await sharp({
      create: { width: px.w, height: px.h, channels: 4, background: SPLASH_BG },
    })
      .composite([{ input: logo, gravity: "centre" }])
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(splashDir, file));

    splashScreens.push({
      url: `/splash/${file}`,
      media: `screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`,
    });
  }

  // 6. layout.tsx 가 그대로 import 하는 스플래시 목록
  const banner =
    "// 이 파일은 scripts/generate-pwa-assets.mjs 가 생성합니다. 직접 수정하지 마세요.\n";
  await writeFile(
    path.join(pwaLibDir, "splash-screens.ts"),
    `${banner}\nexport const appleSplashScreens = ${JSON.stringify(splashScreens, null, 2)};\n`,
  );

  console.log(
    `done: icons 4, apple-icon 1, favicon.ico(16/32/48), icon.svg, splash ${splashScreens.length}`,
  );
}

await main();
