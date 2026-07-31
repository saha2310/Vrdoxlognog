import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
  search?: string;
}

function buildHref(slug: string | null, search?: string) {
  const params = new URLSearchParams();
  if (slug) params.set("category", slug);
  if (search) params.set("search", search);
  const qs = params.toString();
  return qs ? `/catalog?${qs}` : "/catalog";
}

export function CategoryFilter({ categories, activeSlug, search }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref(null, search)}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          !activeSlug ? "border-brass bg-brass text-bone" : "border-line text-ink-soft hover:border-ink"
        }`}
      >
        Все
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildHref(category.slug, search)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeSlug === category.slug
              ? "border-brass bg-brass text-bone"
              : "border-line text-ink-soft hover:border-ink"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
