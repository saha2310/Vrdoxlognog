import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = createAdminClient();
  const [{ count: totalProducts }, { count: published }, { count: draft }, { count: categories }, { count: widgets }] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("widgets").select("id", { count: "exact", head: true }),
    ]);

  return {
    totalProducts: totalProducts ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    categories: categories ?? 0,
    widgets: widgets ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Всего товаров", value: stats.totalProducts, href: "/admin/products" },
    { label: "Опубликовано", value: stats.published, href: "/admin/products?status=published" },
    { label: "Черновики", value: stats.draft, href: "/admin/products?status=draft" },
    { label: "Категории", value: stats.categories, href: "/admin/categories" },
    { label: "Виджеты", value: stats.widgets, href: "/admin/widgets" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="spec-tag inline-block px-2 py-1 mb-3">Дашборд</p>
        <h1 className="font-display text-2xl md:text-3xl text-ink">Обзор мастерской</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-sm border border-line bg-bone-dim p-5 hover:border-brass transition-colors"
          >
            <p className="text-3xl font-display text-ink">{card.value}</p>
            <p className="text-sm text-ink-soft mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-brass text-bone px-5 py-2.5 text-sm font-medium hover:bg-brass-deep transition-colors"
        >
          + Добавить товар
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-sm border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-ink transition-colors"
        >
          Управлять категориями
        </Link>
      </div>
    </div>
  );
}
