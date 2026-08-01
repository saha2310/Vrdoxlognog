"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, EmptyState } from "@/components/ui/Feedback";
import { ConfirmDialog } from "@/components/ui/Modal";
import { deleteProduct, setProductStatus, setProductVisibility } from "@/app/actions/products";
import type { Category, Product } from "@/lib/types";

interface ProductRow extends Product {
  category: Category | null;
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleStatus(product: ProductRow) {
    setBusyId(product.id);
    await setProductStatus(product.id, product.status === "published" ? "draft" : "published");
    setBusyId(null);
    router.refresh();
  }

  async function toggleVisibility(product: ProductRow) {
    setBusyId(product.id);
    await setProductVisibility(product.id, !product.is_visible);
    setBusyId(null);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    await deleteProduct(pendingDelete.id);
    setBusyId(null);
    setPendingDelete(null);
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Товаров пока нет"
        description="Добавьте первый товар, чтобы он появился в каталоге."
      />
    );
  }

  return (
    <div className="border border-line rounded-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-bone-dim text-ink-soft text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Категория</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Видимость</th>
            <th className="px-4 py-3 font-medium text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3 text-ink">{product.title}</td>
              <td className="px-4 py-3 text-ink-soft">{product.category?.name ?? "—"}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleStatus(product)}
                  disabled={busyId === product.id}
                  className="cursor-pointer disabled:opacity-50"
                >
                  <Badge tone={product.status === "published" ? "moss" : "ink"}>
                    {product.status === "published" ? "Опубликован" : "Черновик"}
                  </Badge>
                </button>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleVisibility(product)}
                  disabled={busyId === product.id}
                  className="cursor-pointer disabled:opacity-50"
                >
                  <Badge tone={product.is_visible ? "brass" : "ink"}>
                    {product.is_visible ? "Показан" : "Скрыт"}
                  </Badge>
                </button>
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                <Link href={`/admin/products/${product.id}/edit`} className="text-brass-deep hover:underline">
                  Изменить
                </Link>
                <button
                  onClick={() => setPendingDelete(product)}
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
        title="Удалить товар?"
        message={`Товар «${pendingDelete?.title}» и все его фотографии будут удалены без возможности восстановления.`}
        confirmLabel="Удалить"
        danger
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
