export function SearchBar({ category, search }: { category?: string; search?: string }) {
  return (
    <form action="/catalog" method="get" className="flex w-full max-w-sm">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="search"
        defaultValue={search}
        placeholder="Поиск по каталогу…"
        className="w-full rounded-sm border border-line bg-bone px-3 py-2 text-sm placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-brass focus:border-brass"
      />
      <button
        type="submit"
        className="shrink-0 ml-2 rounded-sm border border-line px-4 py-2 text-sm text-ink-soft hover:border-ink transition-colors"
      >
        Найти
      </button>
    </form>
  );
}
