import { getPublishedProducts, getVisibleCategories } from "@/lib/queries";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SearchBar } from "@/components/catalog/SearchBar";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 12;

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

export const metadata = {
  title: "Каталог — Мебельная мастерская",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [categories, { products, total }] = await Promise.all([
    getVisibleCategories(),
    getPublishedProducts({
      category: params.category,
      search: params.search,
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildHref(targetPage: number) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (targetPage > 1) query.set("page", String(targetPage));
    const qs = query.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  }

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Каталог</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <CategoryFilter categories={categories} activeSlugs={params.category} search={params.search} />
        <SearchBar category={params.category} search={params.search} />
      </div>

      <ProductGrid products={products} />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
