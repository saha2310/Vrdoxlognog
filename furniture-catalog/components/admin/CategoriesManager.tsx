"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge, EmptyState } from "@/components/ui/Feedback";
import { CategoryForm } from "./CategoryForm";
import { deleteCategory } from "@/app/actions/categories";
import type { Category } from "@/lib/types";

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    setFormOpen(false);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteCategory(pendingDelete.id);
    setDeleting(false);

    if (!result.success) {
      setDeleteError(result.error.message);
      return;
    }
    setPendingDelete(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl text-ink">Категории</h1>
        <Button onClick={openCreate}>+ Добавить категорию</Button>
      </div>

      {initialCategories.length === 0 ? (
        <EmptyState title="Категорий пока нет" description="Создайте первую категорию, чтобы добавлять товары." />
      ) : (
        <div className="border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bone-dim text-ink-soft text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Порядок</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {initialCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 text-ink">{category.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{category.sort_order}</td>
                  <td className="px-4 py-3">
                    <Badge tone={category.is_visible ? "moss" : "ink"}>
                      {category.is_visible ? "Видима" : "Скрыта"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(category)}
                      className="text-brass-deep hover:underline cursor-pointer"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete(category);
                      }}
                      className="text-danger hover:underline cursor-pointer"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Изменить категорию" : "Новая категория"}
      >
        <CategoryForm category={editing} onSuccess={handleFormSuccess} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Удалить категорию?"
        message={
          deleteError ??
          `Вы уверены, что хотите удалить категорию «${pendingDelete?.name}»? Это действие нельзя отменить.`
        }
        confirmLabel="Удалить"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
