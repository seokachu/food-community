import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { TopNavigation } from "@/components/ui/TopNavigation";

export const metadata = { title: "둘러보기 · 숨은맛집" };

/**
 * 바텀내비게이션 4개 항목 중 `둘러보기` 만 design.pen 에 화면 시안이 없다.
 * 이번 핸드오프 범위(5장)에 들어가지 않아 자리만 잡아 둔다. 링크가 404 로
 * 떨어지지 않게 하는 것이 목적이고, 시안이 나오면 이 파일을 교체하면 된다.
 */
export default function ExplorePage() {
  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="둘러보기"
          leading={<IconButton as={Link} href="/" icon="arrow-left" label="뒤로가기" />}
        />
      }
    >
      <Container className="flex flex-1 items-center justify-center py-10">
        <EmptyState
          icon="search"
          title="둘러보기 화면은 준비 중이에요"
          description="design.pen 에 아직 시안이 없어 이번 핸드오프에는 포함되지 않았습니다."
          actions={
            <Button as={Link} href="/" variant="secondary">
              홈으로
            </Button>
          }
        />
      </Container>
    </AppShell>
  );
}
