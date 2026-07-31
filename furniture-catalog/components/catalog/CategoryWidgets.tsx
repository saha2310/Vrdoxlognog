import Link from "next/link";
import Image from "next/image";
import { getStorageUrl, getWidgetHref } from "@/lib/storage";
import type { WidgetWithCategories } from "@/lib/types";

export function CategoryWidgets({ widgets }: { widgets: WidgetWithCategories[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <Link
          key={widget.id}
          href={getWidgetHref(widget)}
          className="group flex flex-col rounded-sm border border-line overflow-hidden hover:border-brass transition-colors"
        >
          <div className="relative aspect-[4/3] bg-bone-dim overflow-hidden">
            {widget.image_storage_path ? (
              <Image
                src={getStorageUrl(widget.image_storage_path)}
                alt={widget.title}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-soft/30 text-xs">
                Нет фото
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium text-ink">{widget.title}</span>
            <span className="text-brass-deep transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
