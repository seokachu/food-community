-- 소프트삭제: deleted_at 이 null 이면 노출, 값이 있으면 숨김.
-- 컬럼은 대시보드에서 먼저 추가되어 있어 멱등(if not exists)으로 기록만 맞춘다.
alter table public.place add column if not exists deleted_at timestamptz;

comment on column public.place.deleted_at is '소프트삭제 시각. null 이면 노출 중, 값이 있으면 목록·상세에서 제외한다.';

-- 목록 조회가 항상 deleted_at is null 로 거르므로 활성 행만 담는 부분 인덱스를 둔다.
create index if not exists place_active_created_at_idx
  on public.place (created_at desc)
  where deleted_at is null;
