import { createAdminClient } from "@/lib/supabase/server";
import type { Category, ProductWithRelations, SiteContentKey } from "@/lib/types";

// Публичные SELECT-запросы читаем через service role на сервере (Server Components),
// чтобы не зависеть от RLS-политик анонимного доступа, но фильтрацию
// published/is_visible всегда делаем явно в самом запросе — так требует раздел 2 гайда.

const PRODUCT_LIST_SELECT = "*, category:categories(*), images:product_images(*)";

export async function getVisibleCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export interface CatalogFilters {
  category?: string; // slug категории
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getPublishedProducts(filters: CatalogFilters = {}) {
  const { category, search, page = 1, pageSize = 12 } = filters;
  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT, { count: "exact" })
    .eq("status", "published")
    .eq("is_visible", true);

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .eq("is_visible", true)
      .maybeSingle();

    if (!cat) {
      return { products: [] as ProductWithRelations[], total: 0 };
    }
    query = query.eq("category_id", cat.id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("sort_order", { ascending: true })
    .range(from, to);

  if (error) throw error;

  return {
    products: (data ?? []) as unknown as ProductWithRelations[],
    total: count ?? 0,
  };
}

export async function getLatestPublishedProducts(limit: number): Promise<ProductWithRelations[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("status", "published")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_visible", true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export async function getSiteContent<T = Record<string, unknown>>(
  key: SiteContentKey
): Promise<T> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return (data?.data ?? {}) as T;
}

