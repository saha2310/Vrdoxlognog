"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStorageUrl } from "@/lib/storage";
import { deleteProductImage, setCoverImage, reorderProductImages } from "@/app/actions/images";
import { Badge, ErrorMessage } from "@/components/ui/Feedback";
import { ConfirmDialog } from "@/components/ui/Modal";
import type { ProductImage } from "@/lib/types";

export function ImageSorter({ productId, images }: { productId: string; images: ProductImage[] }) {
  const router = useRouter();
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.sort_order - b.sort_order;
  });
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;

    const reordered = [...sorted];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    setBusyId(sorted[index].id);
    const result = await reorderProductImages(productId, reordered.map((img) => img.id));
    setBusyId(null);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  async function handleSetCover(imageId: string) {
    setBusyId(imageId);
    const result = await setCoverImage(productId, imageId);
    setBusyId(null);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!pendingDeleteId) return;
    setBusyId(pendingDeleteId);
    const result = await deleteProductImage(pendingDeleteId);
    setBusyId(null);
    setPendingDeleteId(null);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {error && <ErrorMessage message={error} />}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sorted.map((img, index) => (
          <div key={img.id} className="flex flex-col gap-2 rounded-sm border border-line p-2">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-bone-dim">
              <Image src={getStorageUrl(img.storage_path)} alt="" fill className="object-cover" />
              {img.is_cover && (
                <span className="absolute top-1 left-1">
                  <Badge tone="brass">Обложка</Badge>
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 text-xs">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0 || busyId === img.id}
                className="px-2 py-1 border border-line rounded-sm hover:border-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sorted.length - 1 || busyId === img.id}
                className="px-2 py-1 border border-line rounded-sm hover:border-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                ↓
              </button>
              {!img.is_cover && (
                <button
                  type="button"
                  onClick={() => handleSetCover(img.id)}
                  disabled={busyId === img.id}
                  className="px-2 py-1 border border-line rounded-sm hover:border-brass cursor-pointer flex-1"
                >
                  Сделать обложкой
                </button>
              )}
              <button
                type="button"
                onClick={() => setPendingDeleteId(img.id)}
                disabled={busyId === img.id}
                className="px-2 py-1 border border-line rounded-sm text-danger hover:border-danger cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Удалить изображение?"
        message="Файл будет удалён без возможности восстановления."
        confirmLabel="Удалить"
        danger
        loading={busyId === pendingDeleteId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
