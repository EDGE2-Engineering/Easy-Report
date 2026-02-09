-- -----------------------------------------------------------------------------
-- 0. Cleanup existing objects
-- -----------------------------------------------------------------------------
drop table if exists public.users cascade;
drop table if exists public.app_users cascade;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: app_users
-- -----------------------------------------------------------------------------

create table if not exists public.app_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password text not null,
  full_name text,
  role text not null check (role in ('admin', 'standard')),
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.app_users enable row level security;

drop policy if exists "Users are viewable by everyone" on public.app_users;
create policy "Users are viewable by everyone"
  on public.app_users for select
  using ( true );

drop policy if exists "Allow public management of users" on public.app_users;
create policy "Allow public management of users"
  on public.app_users for all
  using ( true )
  with check ( true );

insert into public.app_users (username, password, full_name, role, is_active) values
('admin', 'admin123', 'Administrator', 'admin', true),
('user', 'user123', 'Standard User', 'standard', true),
('test', 'test123', 'Test User', 'standard', false)
on conflict (username) do nothing;

-- -----------------------------------------------------------------------------
-- 2. Table: clients
-- -----------------------------------------------------------------------------
create table if not exists public.clients (
  id text primary key,
  client_name text not null,
  client_address text default '',
  email text default '',
  phone text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);