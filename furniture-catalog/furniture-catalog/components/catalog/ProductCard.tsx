import Link from "next/link";
import Image from "next/image";
import { getCoverImage, getStorageUrl } from "@/lib/storage";
import type { ProductWithRelations } from "@/lib/types";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const cover = getCoverImage(product.images);

  return (
    <Link href={`/catalog/${product.slug}`} className="group flex flex-col">
      <div className="corner-marks relative aspect-[4/5] overflow-hidden bg-bone-dim">
        {cover ? (
          <Image
            src={getStorageUrl(cover.storage_path)}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/40 text-sm">
            Нет фото
          </div>
        )}
      </div>
      <div className="pt-3 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-ink-soft/70">{product.category?.name}</p>
        <h3 className="font-display text-lg text-ink group-hover:text-brass-deep transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-ink-soft">
          {product.price_on_request || !product.price
            ? "Цена по запросу"
            : `${new Intl.NumberFormat("ru-RU").format(product.price)} ₽`}
        </p>
      </div>
    </Link>
  );
}
