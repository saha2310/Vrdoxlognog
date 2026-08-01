import Link from "next/link";
import { getAllWidgetsAdmin } from "@/lib/queries";
import { WidgetsTable } from "@/components/admin/WidgetsTable";

export default async function AdminWidgetsPage() {
  const widgets = await getAllWidgetsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl text-ink">Виджеты</h1>
        <Link
          href="/admin/widgets/new"
          className="rounded-sm bg-brass text-bone px-5 py-2.5 text-sm font-medium hover:bg-brass-deep transition-colors"
        >
          + Добавить виджет
        </Link>
      </div>
      <p className="text-sm text-ink-soft max-w-2xl">
        Виджеты — это плитки «Каталог по категориям» на главной странице. У каждого своя картинка и
        привязка к одной или нескольким категориям: клик по виджету откроет каталог с уже включённым
        фильтром.
      </p>
      <WidgetsTable widgets={widgets} />
    </div>
  );
}
