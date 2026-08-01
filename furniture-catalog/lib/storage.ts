import type { ProductImage, WidgetWithCategories } from "@/lib/types";

// Публичный URL строится напрямую по адресу проекта — не требует клиента
// и одинаково работает в серверных и клиентских компонентах (без server-only импортов).
export function getStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

export function getCoverImage(images: ProductImage[]): ProductImage | undefined {
  return images.find((img) => img.is_cover) ?? images[0];
}

// Собирает href для виджета: если у него есть категории — фильтр по ним (через запятую),
// иначе просто ссылка на весь каталог.
export function getWidgetHref(widget: Pick<WidgetWithCategories, "categories">): string {
  if (widget.categories.length === 0) return "/catalog";
  const slugs = widget.categories.map((c) => c.slug).join(",");
  return `/catalog?category=${encodeURIComponent(slugs)}`;
}
