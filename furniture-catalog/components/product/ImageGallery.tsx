"use client";

import { useState } from "react";
import Image from "next/image";
import { getStorageUrl } from "@/lib/storage";
import type { ProductImage } from "@/lib/types";

export function ImageGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.sort_order - b.sort_order;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="corner-marks aspect-square flex items-center justify-center bg-bone-dim text-ink-soft/40 text-sm">
        Нет фото
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="corner-marks relative aspect-square overflow-hidden bg-bone-dim">
        <Image
          src={getStorageUrl(active.storage_path)}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Изображение ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                index === activeIndex ? "border-brass" : "border-transparent hover:border-line"
              }`}
            >
              <Image src={getStorageUrl(img.storage_path)} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
