import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { getAllCategoriesAdmin } from "@/lib/queries";
import { ProductsTable } from "@/components/admin/ProductsTable";

interface AdminProductsPageProps {
  searchParams: Promise<{ status?: string; category?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (params.status === "published" || params.status === "draft") {
    query = query.eq("status", params.status);
  }
  if (params.category) {
    query = query.eq("category_id", params.category);
  }

  const [{ data: products }, categories] = await Promise.all([query, getAllCategoriesAdmin()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl text-ink">Товары</h1>
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-brass text-bone px-5 py-2.5 text-sm font-medium hover:bg-brass-deep transition-colors"
        >
          + Добавить товар
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/products"
          className={`rounded-full border px-3 py-1 ${!params.status ? "border-brass bg-brass text-bone" : "border-line text-ink-soft"}`}
        >
          Все
        </Link>
        <Link
          href="/admin/products?status=published"
          className={`rounded-full border px-3 py-1 ${params.status === "published" ? "border-brass bg-brass text-bone" : "border-line text-ink-soft"}`}
        >
          Опубликованные
        </Link>
        <Link
          href="/admin/products?status=draft"
          className={`rounded-full border px-3 py-1 ${params.status === "draft" ? "border-brass bg-brass text-bone" : "border-line text-ink-soft"}`}
        >
          Черновики
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/products?category=${c.id}`}
            className={`rounded-full border px-3 py-1 ${params.category === c.id ? "border-brass bg-brass text-bone" : "border-line text-ink-soft"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  );
}
