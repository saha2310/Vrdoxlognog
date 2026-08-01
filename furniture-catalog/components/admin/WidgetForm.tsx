"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/Feedback";
import { createWidget, updateWidget } from "@/app/actions/widgets";
import type { Category, Widget } from "@/lib/types";

interface WidgetFormProps {
  widget?: Widget;
  categories: Category[];
}

export function WidgetForm({ widget, categories }: WidgetFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(widget?.title ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(widget?.category_ids ?? []);
  const [sortOrder, setSortOrder] = useState(widget?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(widget?.is_visible ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, category_ids: categoryIds, sort_order: sortOrder, is_visible: isVisible };
    const result = widget ? await updateWidget({ ...payload, id: widget.id }) : await createWidget(payload);

    setLoading(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }

    if (!widget) {
      router.push(`/admin/widgets/${result.data.id}/edit`);
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      {error && <ErrorMessage message={error} />}

      <Input id="title" label="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <div>
        <p className="text-sm font-medium text-ink-soft mb-2">
          Категории (при клике на виджет откроется каталог с этим фильтром)
        </p>
        {categories.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Сначала создайте категории.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                  categoryIds.includes(c.id)
                    ? "border-brass bg-brass/10 text-brass-deep"
                    : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={categoryIds.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                  className="h-3.5 w-3.5 accent-brass"
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
        <p className="text-xs text-ink-soft/60 mt-2">
          Ничего не выбрано — виджет ведёт на весь каталог без фильтра.
        </p>
      </div>

      <Input
        id="sort-order"
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
        Показывать на сайте
      </label>

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? "Сохраняем…" : widget ? "Сохранить изменения" : "Создать виджет"}
        </Button>
      </div>
    </form>
  );
}
