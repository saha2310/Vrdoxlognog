-- Схема БД для сайта-каталога мебельной мастерской
-- Выполнить в Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  title text not null,
  slug text not null unique,
  description text,
  material text,
  dimensions text,
  price numeric,
  price_on_request boolean default false,
  status text not null default 'draft' check (status in ('draft','published')),
  is_visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  sort_order int default 0,
  is_cover boolean default false,
  created_at timestamptz default now()
);

-- Единая таблица под редактируемый контент вместо отдельных pages/contacts/site_settings.
create table if not exists site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into site_content (key, data) values
  ('settings', '{"companyName":"","heroTitle":"","heroSubtitle":"","heroButtonText":"","heroButtonLink":"","productsOnHome":4}'),
  ('contacts', '{"phone":"","whatsapp":"","telegram":"","email":"","address":"","workingHours":"","mapUrl":""}'),
  ('about', '{"content":""}'),
  ('home', '{}')
on conflict (key) do nothing;

-- Виджеты категорий на главной странице ("Каталог по категориям").
-- Каждый виджет — картинка + название + ссылка на одну или несколько категорий.
-- При клике на сайте открывается /catalog с уже включённым фильтром по этим категориям.
create table if not exists widgets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_storage_path text,
  category_ids uuid[] not null default '{}',
  sort_order int default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create index if not exists widgets_sort_order_idx on widgets (sort_order);

alter table widgets enable row level security;
create policy "public_read_widgets" on widgets for select using (true);

-- Индексы
create index if not exists products_slug_idx on products (slug);
create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_status_idx on products (status);
create index if not exists products_is_visible_idx on products (is_visible);
create index if not exists categories_slug_idx on categories (slug);
create index if not exists product_images_product_id_idx on product_images (product_id);

-- RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table site_content enable row level security;

-- SELECT разрешён всем (anon). Фильтрация published/is_visible делается в коде на уровне запроса, не здесь.
create policy "public_read_categories" on categories for select using (true);
create policy "public_read_products" on products for select using (true);
create policy "public_read_product_images" on product_images for select using (true);
create policy "public_read_site_content" on site_content for select using (true);

-- Запись (INSERT/UPDATE/DELETE) через anon-ключ запрещена.
-- Все изменения идут через Server Actions с service role ключом (обходит RLS),
-- поэтому отдельные write-политики для anon-роли не создаются.

-- Storage: bucket для изображений товаров
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public_read_product_images_storage" on storage.objects
  for select using (bucket_id = 'product-images');
