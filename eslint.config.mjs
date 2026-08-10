// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 빌드 산출물 — 번들된 JS 를 린트하면 수천 건의 가짜 경고가 난다
    "storybook-static/**",
    // 코드젠 결과물
    "src/tokens/generated.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  // Supabase 는 BFF(서버) 경유만 허용한다. supabase-js/@supabase/ssr 을 직접 잡으면
  // 클라이언트 컴포넌트에서도 호출할 수 있게 되므로 래퍼 모듈 밖에서는 import 를 막는다.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/supabase/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@supabase/*"],
              message:
                "Supabase 직접 호출 금지. 서버(Route Handler·Server Action·서버 컴포넌트)에서 src/lib/supabase/server.ts 의 createClient() 를 쓰고, 클라이언트는 /api/... 만 호출한다.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
