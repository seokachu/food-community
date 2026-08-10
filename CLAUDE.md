@AGENTS.md

# Design SSOT

- 스토리북(`src/stories/`)이 디자인 SSOT다.
- 모든 UI 작업 시 스토리북 스토리에 있는 컴포넌트(`src/components/`)를 가져다 재사용한다.
- 스토리에 없는 UI가 필요하면 컴포넌트와 스토리를 먼저 추가한 뒤 사용한다.

# 해상도 / 반응형

- 콘텐츠 폭은 `Container`(`src/components/layout/Container.tsx`)만 사용한다. 최대 1280px, 그 이상은 좌우 여백.
- 거터: `px-4 md:px-6 lg:px-8`.
- 카드 그리드: `grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3`. 1 → 2 → 3 컬럼 유지.
- 폼·로그인 등 단일 컬럼 화면은 `NarrowColumn`(640px).
- 내비게이션: `<768` TopNavigation + 고정 BottomNavigation, `≥768` HeaderNavigation 하나(`AppShell`).
- 고정 폭(`w-[…px]`), 페이지별 `max-w`, 새 브레이크포인트를 임의로 만들지 않는다.

## 참고 경로

- 스토리: `src/stories/foundation/`
- 컴포넌트: `src/components/foundation/` (`Icon.tsx`, `Text.tsx`)
- 디자인 토큰: `src/tokens/` (`generated.ts`, `pencil-tokens.json`, `type-scale.json`, `icon-registry.json`), `src/app/tokens.css`
- 스토리북 설정: `.storybook/`

# Supabase (BFF 필수)

- 모든 Supabase API(Auth, DB, Storage 등)는 Next.js BFF를 통해서만 구현한다. 즉, Supabase 호출은 서버 측(Route Handler `src/app/api/`, Server Action, 서버 컴포넌트)에서만 수행한다.
- 클라이언트 컴포넌트에서 `supabase-js`로 Supabase를 직접 호출하지 않는다. 클라이언트는 내부 API(`/api/...`)만 호출한다.
- Supabase 키·클라이언트 생성 코드는 서버 전용 모듈에 두고, 클라이언트 번들에 노출하지 않는다. 환경변수에 `NEXT_PUBLIC_` 접두사를 쓰지 않는다.
- 위 두 규칙은 강제된다: `src/lib/supabase/**`는 `server-only`를 import하고, 그 밖에서 `@supabase/*`를 직접 import하면 ESLint가 막는다.

## 접근 제어 (RLS · Storage)

- `place`·`place_image`·`profile` 모두 RLS가 켜져 있다. 읽기는 비로그인(anon) 포함 공개, 쓰기(INSERT/UPDATE/DELETE)는 작성자 본인만. `place_image`의 소유권은 `place.user_id`를 거쳐 판정한다.
- 새 테이블을 만들면 정책도 같이 추가한다. RLS만 켜고 정책이 없으면 BFF에서도 항상 0행이 나온다.
- Storage 업로드 경로는 `<user_id>/<파일명>` 형태를 지킨다. 정책이 첫 폴더명을 소유자로 보고 판정한다. 버킷은 `place-image`, `profile-image`.
- 인가 판단에 `user_metadata`(JWT claims)를 쓰지 않는다. 사용자가 직접 바꿀 수 있으므로 화면 표시용으로만 쓴다.
- 스키마·정책 변경은 MCP `apply_migration`으로 적용하고, 같은 SQL을 `supabase/migrations/<version>_<name>.sql`로 남긴다. 변경 후 MCP `get_advisors`로 확인한다.

## Supabase 참고 경로

- 서버 클라이언트: `src/lib/supabase/server.ts`의 `createClient()` — Route Handler·Server Action·서버 컴포넌트 공용, 쿠키 세션 기반(RLS 적용)
- 세션 갱신: `src/proxy.ts` → `src/lib/supabase/proxy.ts`의 `updateSession()` (Next.js 16은 middleware 대신 proxy)
- DB 타입: `src/lib/supabase/database.types.ts` — 스키마 변경 시 MCP `generate_typescript_types`로 재생성
- 환경변수: `.env.local` (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`), 템플릿은 `.env.example`
- 마이그레이션 기록: `supabase/migrations/` — 원격에 적용한 SQL과 같은 내용을 보관한다
- 연결 점검용 BFF 라우트: `src/app/api/health/route.ts` (`GET /api/health` → `{ ok, placeCount }`)
