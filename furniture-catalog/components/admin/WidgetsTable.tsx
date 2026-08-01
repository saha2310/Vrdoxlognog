"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStorageUrl } from "@/lib/storage";
import { Badge, EmptyState } from "@/components/ui/Feedback";
import { ConfirmDialog } from "@/components/ui/Modal";
import { deleteWidget, setWidgetVisibility } from "@/app/actions/widgets";
import type { WidgetWithCategories } from "@/lib/types";

export function WidgetsTable({ widgets }: { widgets: WidgetWithCategories[] }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<WidgetWithCategories | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleVisibility(widget: WidgetWithCategories) {
    setBusyId(widget.id);
    await setWidgetVisibility(widget.id, !widget.is_visible);
    setBusyId(null);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    await deleteWidget(pendingDelete.id);
    setBusyId(null);
    setPendingDelete(null);
    router.refresh();
  }

  if (widgets.length === 0) {
    return (
      <EmptyState
        title="Виджетов пока нет"
        description="Добавьте виджет, чтобы на главной появилась плитка-ссылка на категорию каталога."
      />
    );
  }

  return (
    <div className="border border-line rounded-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-bone-dim text-ink-soft text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Картинка</th>
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Категории</th>
            <th className="px-4 py-3 font-medium">Видимость</th>
            <th className="px-4 py-3 font-medium text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {widgets.map((widget) => (
            <tr key={widget.id}>
              <td className="px-4 py-3">
                <div className="relative h-12 w-16 overflow-hidden rounded-sm bg-bone-dim">
                  {widget.image_storage_path && (
                    <Image
                      src={getStorageUrl(widget.image_storage_path)}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-ink">{widget.title}</td>
              <td className="px-4 py-3 text-ink-soft">
                {widget.categories.length > 0
                  ? widget.categories.map((c) => c.name).join(", ")
                  : "Весь каталог"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleVisibility(widget)}
                  disabled={busyId === widget.id}
                  className="cursor-pointer disabled:opacity-50"
                >
                  <Badge tone={widget.is_visible ? "brass" : "ink"}>
                    {widget.is_visible ? "Показан" : "Скрыт"}
                  </Badge>
                </button>
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                <Link href={`/admin/widgets/${widget.id}/edit`} className="text-brass-deep hover:underline">
                  Изменить
                </Link>
                <button
                  onClick={() => setPendingDelete(widget)}
                  className="text-danger hover:underline cursor-pointer"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Удалить виджет?"
        message={`Виджет «${pendingDelete?.title}» и его картинка будут удалены без возможности восстановления.`}
        confirmLabel="Удалить"
        danger
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
