-- ============================================
-- PATIKA — Supabase Veritabanı Şeması
-- Supabase SQL editöründe çalıştır
-- ============================================

-- UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PETS
-- =====================
create table public.pets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  species text not null check (species in ('dog', 'cat', 'other')),
  breed text,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  neutered boolean default false,
  microchip_no text,
  photo_url text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table public.pets enable row level security;
create policy "Kullanıcı kendi hayvanlarını yönetebilir" on public.pets
  for all using (auth.uid() = user_id);

-- =====================
-- VACCINATIONS
-- =====================
create table public.vaccinations (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  vaccine_name text not null,
  date_given date not null,
  next_due_date date,
  administered_by text,
  notes text
);

alter table public.vaccinations enable row level security;
create policy "Kullanıcı kendi hayvanının aşılarını yönetebilir" on public.vaccinations
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- MEDICATIONS
-- =====================
create table public.medications (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  med_name text not null,
  dose text not null,
  frequency text not null,
  start_date date not null,
  end_date date,
  reminder_enabled boolean default true
);

alter table public.medications enable row level security;
create policy "Kullanıcı kendi hayvanının ilaçlarını yönetebilir" on public.medications
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- HEALTH LOGS
-- =====================
create table public.health_logs (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  date date not null default current_date,
  weight numeric(5,2),
  appetite_score smallint check (appetite_score between 1 and 5),
  stool_condition text check (stool_condition in ('normal','soft','liquid','hard','none')),
  vomiting boolean default false,
  energy_level smallint check (energy_level between 1 and 5),
  notes text,
  symptoms_text text
);

alter table public.health_logs enable row level security;
create policy "Kullanıcı kendi hayvanının sağlık günlüğünü yönetebilir" on public.health_logs
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- FEEDING SCHEDULES
-- =====================
create table public.feeding_schedules (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  food_name text not null,
  food_brand text,
  barcode text,
  meal_times text[] not null default '{}',
  portion_size numeric(6,2),
  unit text
);

alter table public.feeding_schedules enable row level security;
create policy "Kullanıcı kendi hayvanının beslenme planını yönetebilir" on public.feeding_schedules
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- APPOINTMENTS
-- =====================
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  vet_name text not null,
  vet_phone text,
  date_time timestamptz not null,
  appointment_type text not null check (appointment_type in ('vet','grooming','vaccine','other')),
  notes text,
  reminder_minutes_before integer default 60
);

alter table public.appointments enable row level security;
create policy "Kullanıcı kendi hayvanının randevularını yönetebilir" on public.appointments
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- DOCUMENTS
-- =====================
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  title text not null,
  file_url text not null,
  file_type text not null,
  category text not null check (category in ('report','bloodwork','xray','prescription','other')),
  uploaded_at timestamptz default now()
);

alter table public.documents enable row level security;
create policy "Kullanıcı kendi hayvanının belgelerini yönetebilir" on public.documents
  for all using (
    exists (select 1 from public.pets where id = pet_id and user_id = auth.uid())
  );

-- =====================
-- AI CONSULTATIONS
-- =====================
create table public.ai_consultations (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_input text not null,
  ai_response text not null,
  urgency_level text not null check (urgency_level in ('NORMAL','DİKKAT','ACİL')),
  created_at timestamptz default now()
);

alter table public.ai_consultations enable row level security;
create policy "Kullanıcı kendi AI sorgularını görebilir" on public.ai_consultations
  for all using (auth.uid() = user_id);

-- =====================
-- STORAGE BUCKETS
-- =====================
insert into storage.buckets (id, name, public) values ('pet-photos', 'pet-photos', true);
insert into storage.buckets (id, name, public) values ('pet-documents', 'pet-documents', false);

-- Storage RLS
create policy "Herkes hayvan fotoğraflarını görebilir" on storage.objects
  for select using (bucket_id = 'pet-photos');

create policy "Kullanıcı kendi fotoğrafını yükleyebilir" on storage.objects
  for insert with check (bucket_id = 'pet-photos' and auth.role() = 'authenticated');

create policy "Kullanıcı kendi belgesini yönetebilir" on storage.objects
  for all using (bucket_id = 'pet-documents' and auth.uid()::text = (storage.foldername(name))[1]);
