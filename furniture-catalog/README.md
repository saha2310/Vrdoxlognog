# МебельГрад

Next.js 15 + TypeScript + Tailwind + Supabase — магазин мебели.

## Установка

```bash
npm install
```

## Настройка

1. Создайте проект в Supabase
2. Примените миграции из `supabase/migrations/`
3. Скопируйте `.env.local.example` → `.env.local` и заполните ключи

## Запуск

```bash
npm run dev
```

## Структура

- `app/` — страницы Next.js App Router
- `components/` — UI-компоненты
- `lib/` — утилиты, типы, Supabase-клиенты
- `actions/` — Server Actions (CRUD)
- `supabase/migrations/` — SQL-схема

## Админ-панель

Откройте `/admin/products`, `/admin/categories`, `/admin/widgets`
