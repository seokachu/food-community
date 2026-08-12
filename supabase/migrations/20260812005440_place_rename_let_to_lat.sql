-- 위도 컬럼이 오타(let)로 생성되어 있어 lat 로 바로잡는다.
alter table public.place rename column "let" to lat;

comment on column public.place.name is '장소명. 네이버 지역검색에서 고르거나 직접 입력한 값.';
comment on column public.place.lat is '위도(WGS84). 지도 핀 위치.';
comment on column public.place.lng is '경도(WGS84). 지도 핀 위치.';
comment on column public.place.address is '지번주소. 리버스 지오코딩 또는 지역검색 결과.';
