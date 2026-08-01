create table widgets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  category_ids uuid[] default '{}',
  sort_order int default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

alter table widgets enable row level security;
create policy "public read widgets" on widgets for select to anon using (is_visible = true);
