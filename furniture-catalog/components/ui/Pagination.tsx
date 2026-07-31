import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Пагинация" className="flex items-center justify-center gap-2 pt-8">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`px-3 py-1.5 text-sm border border-line rounded-sm ${
          currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-ink"
        }`}
      >
        Назад
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`h-9 w-9 flex items-center justify-center text-sm rounded-sm border ${
            page === currentPage
              ? "border-brass bg-brass text-bone"
              : "border-line hover:border-ink"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-1.5 text-sm border border-line rounded-sm ${
          currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:border-ink"
        }`}
      >
        Вперёд
      </Link>
    </nav>
  );
}
