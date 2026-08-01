-- Миграция для уже существующей базы: добавляет таблицу widgets.
-- Если вы разворачиваете проект с нуля — этот файл не нужен,
-- таблица уже включена в supabase/schema.sql.

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

drop policy if exists "public_read_widgets" on widgets;
create policy "public_read_widgets" on widgets for select using (true);
