import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getAllCategoriesAdmin } from "@/lib/queries";
import { WidgetForm } from "@/components/admin/WidgetForm";
import { WidgetImageUpload } from "@/components/admin/WidgetImageUpload";
import type { Widget } from "@/lib/types";

interface EditWidgetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWidgetPage({ params }: EditWidgetPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: widget }, categories] = await Promise.all([
    supabase.from("widgets").select("*").eq("id", id).maybeSingle(),
    getAllCategoriesAdmin(),
  ]);

  if (!widget) notFound();

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl md:text-3xl text-ink">Редактирование: {widget.title}</h1>

      <WidgetForm widget={widget as Widget} categories={categories} />

      <div className="max-w-xl flex flex-col gap-4 border-t border-line pt-8">
        <h2 className="font-display text-xl text-ink">Картинка</h2>
        <WidgetImageUpload widgetId={widget.id} currentPath={widget.image_storage_path} />
      </div>
    </div>
  );
}
