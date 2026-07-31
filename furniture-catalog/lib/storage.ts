import type { ProductImage } from "@/lib/types";

// Публичный URL строится напрямую по адресу проекта — не требует клиента
// и одинаково работает в серверных и клиентских компонентах (без server-only импортов).
export function getStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

export function getCoverImage(images: ProductImage[]): ProductImage | undefined {
  return images.find((img) => img.is_cover) ?? images[0];
}
