# Мебельная мастерская — сайт-каталог

Next.js 14+ (App Router, TypeScript) + Tailwind CSS + Supabase (Postgres, Storage, Auth) + Vercel.

## 1. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. Откройте **SQL Editor** и выполните файл [`supabase/schema.sql`](./supabase/schema.sql) — он создаст таблицы, индексы, RLS-политики и Storage bucket `product-images`.
   - Если вы уже разворачивали проект раньше (до появления раздела «Виджеты») — дополнительно выполните [`supabase/migrations/002_widgets.sql`](./supabase/migrations/002_widgets.sql), он добавит только новую таблицу `widgets`, не трогая остальное.
3. Создайте администратора: **Authentication → Users → Add user** (email + пароль). Именно этот email нужно указать в `ADMIN_EMAIL`.
4. Скопируйте ключи из **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (секретный!) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` обходит RLS. Никогда не публикуйте его и не используйте в клиентском коде (в проекте он используется только в `lib/supabase/server.ts` и Server Actions).

`NEXT_PUBLIC_SITE_URL` — адрес сайта после деплоя (используется в `sitemap.xml`, `robots.txt` и метаданных). Локально можно оставить как есть.

## 3. Локальный запуск

```bash
npm install
npm run dev
```

Сайт: http://localhost:3000
Админка: http://localhost:3000/admin/login

## 4. Деплой на Vercel

1. Импортируйте репозиторий в [vercel.com](https://vercel.com/new).
2. В **Project Settings → Environment Variables** добавьте те же 4 переменные.
3. Деплой запустится автоматически.

## Структура проекта

- `supabase/schema.sql` — схема БД, RLS, Storage bucket
- `lib/supabase/` — клиенты Supabase (browser, server с сессией, admin с service role)
- `lib/validators/` — Zod-схемы
- `app/actions/` — Server Actions (CRUD для товаров, категорий, изображений, контента, авторизация)
- `app/(site)/` — публичные страницы
- `app/admin/` — админ-панель (защищена `proxy.ts` + повторной проверкой в layout и Server Actions)
- `components/` — UI-компоненты по разделам (ui, layout, catalog, product, admin)

### Виджеты и картинка баннера

- **«Виджеты»** в админке — плитки «Каталог по категориям» на главной. У каждого своя картинка и привязка к одной или нескольким категориям; клик открывает `/catalog` с уже включённым фильтром (`?category=slug1,slug2`).
- **«Главная» → картинка баннера** — своя картинка справа от заголовка на главной. Если не загружена, показывается фото последнего опубликованного товара (текст баннера по-прежнему редактируется в «Настройках»).

## Реализованные ограничения

- Максимум 10 фото на товар (проверка на сервере при загрузке).
- Только одна обложка на товар.
- Уникальные slug для товаров и категорий (транслитерация кириллицы + kebab-case).
- Категорию нельзя удалить, если в ней есть товары.
- Неавторизованным посетителям показываются только товары `status = published`, `is_visible = true`, и только видимые категории.
- При удалении товара каскадно удаляются его изображения — в БД и в Storage.
