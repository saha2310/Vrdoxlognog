create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price int not null,
  old_price int,
  category_id uuid references categories(id) on delete set null,
  color text,
  image text,
  is_new boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table categories enable row level security;
alter table products enable row level security;

create policy "public read categories" on categories for select to anon using (is_active = true);
create policy "public read products" on products for select to anon using (is_active = true);
