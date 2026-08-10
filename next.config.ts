import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 디렉토리의 lockfile 때문에 workspace root가 잘못 잡히는 것을 방지
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
