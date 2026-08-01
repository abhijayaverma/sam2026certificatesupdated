create extension if not exists pgcrypto;
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  roll_number text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  download_time timestamptz not null default now(),
  ip text,
  user_agent text,
  status text not null check (status in ('success','failed'))
);
create index if not exists downloads_participant_id_idx on public.downloads(participant_id);
create index if not exists downloads_download_time_idx on public.downloads(download_time desc);
alter table public.participants enable row level security;
alter table public.downloads enable row level security;
create policy "Admins via service role manage participants" on public.participants for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Admins via service role manage downloads" on public.downloads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
