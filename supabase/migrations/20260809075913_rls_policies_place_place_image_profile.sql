-- 읽기는 비로그인 포함 누구나(PRD "로그인 없이 둘러보기"), 쓰기는 작성자 본인만.
-- 모든 접근은 Next.js BFF의 쿠키 세션 클라이언트를 통하므로 anon/authenticated 역할로 평가된다.

-- public.place ---------------------------------------------------------------
create policy "place_select_all"
  on public.place for select
  to anon, authenticated
  using (true);

create policy "place_insert_own"
  on public.place for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "place_update_own"
  on public.place for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "place_delete_own"
  on public.place for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- public.place_image ---------------------------------------------------------
-- 소유권은 place를 거쳐 판단한다(place_image에는 user_id가 없다).
create policy "place_image_select_all"
  on public.place_image for select
  to anon, authenticated
  using (true);

create policy "place_image_insert_own_place"
  on public.place_image for insert
  to authenticated
  with check (
    exists (
      select 1 from public.place p
      where p.id = place_image.place_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "place_image_update_own_place"
  on public.place_image for update
  to authenticated
  using (
    exists (
      select 1 from public.place p
      where p.id = place_image.place_id
        and p.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.place p
      where p.id = place_image.place_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "place_image_delete_own_place"
  on public.place_image for delete
  to authenticated
  using (
    exists (
      select 1 from public.place p
      where p.id = place_image.place_id
        and p.user_id = (select auth.uid())
    )
  );

-- public.profile -------------------------------------------------------------
-- 닉네임·프로필 사진은 글 작성자 표시에 쓰이므로 읽기는 공개한다.
create policy "profile_select_all"
  on public.profile for select
  to anon, authenticated
  using (true);

create policy "profile_insert_own"
  on public.profile for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "profile_update_own"
  on public.profile for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "profile_delete_own"
  on public.profile for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- RLS 술어가 매 행마다 타는 컬럼이라 인덱스를 둔다.
create index if not exists place_user_id_idx on public.place (user_id);
create index if not exists place_image_place_id_idx on public.place_image (place_id);
create index if not exists profile_user_id_idx on public.profile (user_id);
