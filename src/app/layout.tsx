import type { Metadata, Viewport } from "next";
import "./globals.css";

import { appleSplashScreens } from "@/lib/pwa/splash-screens";

export const metadata: Metadata = {
  title: {
    default: "숨은맛집",
    template: "%s",
  },
  description: "design.pen 에서 핸드오프한 숨은맛집 화면",
  applicationName: "숨은맛집",
  // iOS 홈 화면 설치(standalone) + 기기별 스플래시 이미지.
  // Android 쪽 스플래시는 app/manifest.ts 가 담당한다.
  appleWebApp: {
    capable: true,
    title: "숨은맛집",
    statusBarStyle: "default",
    startupImage: appleSplashScreens,
  },
  // capable: true 는 표준 mobile-web-app-capable 만 내보낸다.
  // iOS 16.4 미만은 apple- 접두사 메타만 인식하므로 함께 내보낸다.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFCFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
