-- 유저당 프로필은 하나다. 로그인할 때마다 BFF가 upsert 하므로 중복 삽입을 DB에서 막는다.
-- (유니크 제약이 자체 인덱스를 만들므로 앞서 만든 일반 인덱스는 중복이라 제거한다.)
alter table public.profile
  add constraint profile_user_id_key unique (user_id);

drop index if exists public.profile_user_id_idx;
