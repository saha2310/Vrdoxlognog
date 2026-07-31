"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/Feedback";
import { createCategory, updateCategory } from "@/app/actions/categories";
import type { Category } from "@/lib/types";

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(category?.is_visible ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, sort_order: sortOrder, is_visible: isVisible };
    const result = category
      ? await updateCategory({ ...payload, id: category.id })
      : await createCategory(payload);

    setLoading(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <ErrorMessage message={error} />}
      <Input
        id="category-name"
        label="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        id="category-sort"
        type="number"
        label="Порядок сортировки"
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
      />
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="h-4 w-4 accent-brass"
        />
        Видима на сайте
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Сохраняем…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
