-- 관광지 정보 테이블
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  address text,
  parking_info text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 혼잡도 제보 테이블
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references public.locations(id) on delete cascade,
  congestion_level text not null check (congestion_level in ('원활', '보통', '혼잡', '매우혼잡')),
  parking_level text not null check (parking_level in ('여유', '보통', '부족', '만차')),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 활성화
alter table public.locations enable row level security;
alter table public.reports enable row level security;

-- locations 테이블 정책 (모두가 읽을 수 있음)
create policy "locations_select_all" on public.locations for select using (true);

-- reports 테이블 정책 (모두가 읽을 수 있음)
create policy "reports_select_all" on public.reports for select using (true);

-- reports 테이블 정책 (모두가 제보를 추가할 수 있음)
create policy "reports_insert_all" on public.reports for insert with check (true);

-- 인덱스 생성
create index if not exists reports_location_id_idx on public.reports(location_id);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

-- 제주도 관광지 샘플 데이터
insert into public.locations (name, category, address, parking_info, latitude, longitude) values
  ('성산일출봉', '자연관광', '제주특별자치도 서귀포시 성산읍 성산리', '대형주차장 300대', 33.4581, 126.9429),
  ('섭지코지', '자연관광', '제주특별자치도 서귀포시 성산읍 고성리', '주차장 200대', 33.4247, 126.9283),
  ('우도', '섬관광', '제주특별자치도 제주시 우도면', '선착장 주차 100대', 33.5047, 126.9542),
  ('한라산', '자연관광', '제주특별자치도 제주시', '어리목 주차장 200대', 33.3616, 126.5292),
  ('만장굴', '동굴관광', '제주특별자치도 제주시 구좌읍 김녕리', '주차장 150대', 33.5267, 126.7716),
  ('천지연폭포', '자연관광', '제주특별자치도 서귀포시 천지동', '주차장 80대', 33.2472, 126.5569),
  ('정방폭포', '자연관광', '제주특별자치도 서귀포시 동홍동', '주차장 60대', 33.2447, 126.5719),
  ('주상절리대', '자연관광', '제주특별자치도 서귀포시 중문동', '대형주차장 400대', 33.2372, 126.4242),
  ('용두암', '자연관광', '제주특별자치도 제주시 용담동', '노변주차', 33.5094, 126.5117),
  ('협재해수욕장', '해변', '제주특별자치도 제주시 한림읍 협재리', '주차장 200대', 33.3939, 126.2397),
  ('곽지해수욕장', '해변', '제주특별자치도 제주시 애월읍 곽지리', '주차장 150대', 33.4503, 126.3047),
  ('함덕해수욕장', '해변', '제주특별자치도 제주시 조천읍 함덕리', '주차장 180대', 33.5433, 126.6694),
  ('김녕해수욕장', '해변', '제주특별자치도 제주시 구좌읍 김녕리', '주차장 120대', 33.5547, 126.7589),
  ('중문색달해수욕장', '해변', '제주특별자치도 서귀포시 중문동', '주차장 250대', 33.2442, 126.4119),
  ('표선해수욕장', '해변', '제주특별자치도 서귀포시 표선면 표선리', '주차장 100대', 33.3236, 126.8369),
  ('제주민속촌', '문화관광', '제주특별자치도 서귀포시 표선면 표선리', '주차장 300대', 33.3172, 126.8267),
  ('테디베어뮤지엄', '박물관', '제주특별자치도 서귀포시 중문동', '주차장 150대', 33.2511, 126.4111),
  ('오설록 티뮤지엄', '박물관', '제주특별자치도 서귀포시 안덕면 서광리', '대형주차장 500대', 33.3061, 126.2881),
  ('카멜리아힐', '정원', '제주특별자치도 서귀포시 안덕면 상창리', '주차장 200대', 33.2917, 126.3111),
  ('산방산', '자연관광', '제주특별자치도 서귀포시 안덕면 사계리', '주차장 80대', 33.2347, 126.3136)
on conflict do nothing;
