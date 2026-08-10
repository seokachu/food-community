-- Storage: place-image / profile-image
-- 두 버킷 모두 public이라 조회는 공개 URL로도 가능하지만, API 경유 조회·업로드에는 정책이 필요하다.
-- 업로드 경로 규칙: "<auth.uid()>/<파일명>" — 첫 폴더가 소유자다.

-- place-image ----------------------------------------------------------------
create policy "place_image_object_select_all"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'place-image');

create policy "place_image_object_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'place-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "place_image_object_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'place-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'place-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "place_image_object_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'place-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- profile-image --------------------------------------------------------------
create policy "profile_image_object_select_all"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'profile-image');

create policy "profile_image_object_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'profile-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "profile_image_object_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'profile-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'profile-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "profile_image_object_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'profile-image'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- rls_auto_enable()은 DDL 이벤트 트리거 전용이다. PostgREST의 /rpc로 노출될 이유가 없어
-- PUBLIC 실행 권한을 회수한다(이벤트 트리거 동작에는 영향 없음).
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
