import { getAllCategoriesAdmin } from "@/lib/queries";
import { WidgetForm } from "@/components/admin/WidgetForm";

export default async function NewWidgetPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl md:text-3xl text-ink">Новый виджет</h1>
      <WidgetForm categories={categories} />
      <p className="text-sm text-ink-soft/60 max-w-xl">
        После создания вы сможете загрузить картинку виджета на следующей странице.
      </p>
    </div>
  );
}
