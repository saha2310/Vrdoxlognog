"use client";

import { useRef, useState, useEffect } from "react";
import { getCoverImage, getStorageUrl } from "@/lib/storage";
import Link from "next/link";
import Image from "next/image";
import type { ProductWithRelations } from "@/lib/types";

export function NewArrivalsCarousel({ products }: { products: ProductWithRelations[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.children[0]?.getBoundingClientRect().width ?? 1;
    const index = Math.round(track.scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(index, products.length - 1));
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => {
          const cover = getCoverImage(product.images);
          return (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              className="group shrink-0 snap-start basis-[80%] sm:basis-[45%] lg:basis-[24%] flex flex-col"
            >
              <div className="corner-marks relative aspect-[4/5] overflow-hidden bg-bone-dim rounded-sm">
                {cover ? (
                  <Image
                    src={getStorageUrl(cover.storage_path)}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 80vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-soft/40 text-sm">
                    Нет фото
                  </div>
                )}
              </div>
              <div className="pt-3 flex flex-col gap-1">
                <h3 className="font-display text-lg text-ink group-hover:text-brass-deep transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-ink-soft">
                  {product.price_on_request || !product.price
                    ? "Цена по запросу"
                    : `от ${new Intl.NumberFormat("ru-RU").format(product.price)} ₽`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {products.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {products.map((product, index) => (
            <button
              key={product.id}
              onClick={() => scrollToIndex(index)}
              aria-label={`Товар ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                index === activeIndex ? "w-6 bg-brass" : "w-1.5 bg-line hover:bg-ink-soft/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
