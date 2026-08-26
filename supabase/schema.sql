-- Supabase Schema for Quality Used Cars (Syed Sabeer Riyaz)
-- Run this in your Supabase SQL Editor to initialize the database & analytics

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Cars Table
create table if not exists public.cars (
    id text primary key default uuid_generate_v4()::text,
    name text not null,
    brand text not null,
    model text not null,
    variant text,
    category text default 'Hatchbacks',
    price text not null,
    price_value numeric not null,
    year integer not null,
    fuel text not null,
    transmission text not null,
    owners text not null,
    km_driven text,
    colour text,
    insurance text,
    fc text,
    service_history text,
    keys text,
    manual text,
    description text,
    status text not null default 'AVAILABLE', -- 'AVAILABLE', 'RESERVED', 'SOLD', 'DRAFT'
    image text not null,
    images text[] default array[]::text[],
    is_featured boolean default false,
    views_count integer default 0,
    whatsapp_clicks integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Enquiries Table
create table if not exists public.enquiries (
    id text primary key default uuid_generate_v4()::text,
    customer_name text not null,
    customer_phone text,
    car_id text references public.cars(id) on delete set null,
    car_name text,
    message text not null,
    status text default 'New', -- 'New', 'Contacted', 'Closed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Analytics Events Table
create table if not exists public.analytics_events (
    id text primary key default uuid_generate_v4()::text,
    event_type text not null, -- 'page_view', 'car_view', 'whatsapp_click'
    car_id text references public.cars(id) on delete set null,
    car_name text,
    page_path text,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Dealership Settings Table
create table if not exists public.settings (
    id text primary key default 'main',
    dealership_name text default 'Quality Used Cars',
    owner_name text default 'Sahib Sabir',
    phone text default '919999999999',
    whatsapp text default '919999999999',
    email text default 'syed.ae018@gmail.com',
    location text default 'Bangalore, Karnataka, India',
    about text default 'I help customers find quality pre-owned vehicles. Browse our current collection and contact me directly to schedule a viewing or ask questions.',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Analytics RPC Increment Functions
create or replace function public.increment_car_view(car_id_param text)
returns void as $$
begin
    update public.cars
    set views_count = coalesce(views_count, 0) + 1
    where id = car_id_param;

    insert into public.analytics_events (event_type, car_id)
    values ('car_view', car_id_param);
end;
$$ language plpgsql security definer;

create or replace function public.increment_whatsapp_click(car_id_param text, car_name_param text default null)
returns void as $$
begin
    if car_id_param is not null then
        update public.cars
        set whatsapp_clicks = coalesce(whatsapp_clicks, 0) + 1
        where id = car_id_param;
    end if;

    insert into public.analytics_events (event_type, car_id, car_name)
    values ('whatsapp_click', car_id_param, car_name_param);
end;
$$ language plpgsql security definer;

-- 7. Row Level Security (RLS)
alter table public.cars enable row level security;
alter table public.enquiries enable row level security;
alter table public.analytics_events enable row level security;
alter table public.settings enable row level security;

-- Public can read active cars
create policy "Public can view active cars"
    on public.cars for select
    using (true);

-- Public can insert enquiries
create policy "Public can submit enquiries"
    on public.enquiries for insert
    with check (true);

-- Public can insert analytics
create policy "Public can log analytics"
    on public.analytics_events for insert
    with check (true);

-- Public can view settings
create policy "Public can view settings"
    on public.settings for select
    using (true);

-- Authenticated admins have full CRUD access
create policy "Admins full access to cars"
    on public.cars for all
    using (true)
    with check (true);

create policy "Admins full access to enquiries"
    on public.enquiries for all
    using (true)
    with check (true);

create policy "Admins full access to analytics"
    on public.analytics_events for all
    using (true)
    with check (true);

create policy "Admins full access to settings"
    on public.settings for all
    using (true)
    with check (true);

-- 8. Insert Default Dealership Settings
insert into public.settings (id, dealership_name, owner_name, phone, whatsapp, email, location, about)
values (
    'main',
    'Quality Used Cars',
    'Syed Sabeer Riyaz',
    '919999999999',
    '919999999999',
    'syed.ae018@gmail.com',
    'Bangalore, Karnataka, India',
    'Quality used cars. Honest deals. Simple buying directly with Syed Sabeer Riyaz.'
)
on conflict (id) do update set
    owner_name = excluded.owner_name,
    email = excluded.email,
    about = excluded.about;

-- 9. Storage bucket for direct image uploads
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

create policy "Public can view car images"
    on storage.objects for select
    using (bucket_id = 'car-images');

create policy "Anyone can upload car images"
    on storage.objects for insert
    with check (bucket_id = 'car-images');

create policy "Anyone can delete car images"
    on storage.objects for delete
    using (bucket_id = 'car-images');
