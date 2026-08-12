import type { MetadataRoute } from "next";

/**
 * PWA 웹 앱 매니페스트. Android 는 이 정보만으로 설치 프롬프트와
 * 스플래시(배경색 + 아이콘 + 이름)를 만든다.
 * 아이콘은 scripts/generate-pwa-assets.mjs 가 public/logo.svg 에서 생성한다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "숨은맛집",
    short_name: "숨은맛집",
    description: "나만 아는 숨은 맛집을 기록하고 공유하는 커뮤니티",
    id: "/",
    start_url: "/",
    display: "standalone",
    lang: "ko",
    // 스플래시 배경. --color-background-default(neutral-50)와 맞춘다.
    background_color: "#FAFCFC",
    theme_color: "#FAFCFC",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
