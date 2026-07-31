"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, TextArea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/Feedback";
import { createProduct, updateProduct } from "@/app/actions/products";
import type { Category, Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [dimensions, setDimensions] = useState(product?.dimensions ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [priceOnRequest, setPriceOnRequest] = useState(product?.price_on_request ?? false);
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [isVisible, setIsVisible] = useState(product?.is_visible ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      category_id: categoryId,
      title,
      description,
      material,
      dimensions,
      price: priceOnRequest || price === "" ? null : Number(price),
      price_on_request: priceOnRequest,
      status,
      is_visible: isVisible,
      sort_order: product?.sort_order ?? 0,
    };

    const result = product
      ? await updateProduct({ ...payload, id: product.id })
      : await createProduct(payload);

    setLoading(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }

    if (!product) {
      // После создания переходим на редактирование, чтобы добавить фото
      router.push(`/admin/products/${result.data.id}/edit`);
    } else {
      router.refresh();
    }
  }

  if (categories.length === 0) {
    return (
      <ErrorMessage message="Сначала создайте хотя бы одну категорию, прежде чем добавлять товары." />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {error && <ErrorMessage message={error} />}

      <Input id="title" label="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <Select
        id="category"
        label="Категория"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <TextArea
        id="description"
        label="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex flex-wrap items-end gap-4">
        <Input
          id="price"
          type="number"
          label="Цена, ₽"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={priceOnRequest}
          min={0}
          className="min-w-[10rem] flex-1"
        />

     <div className="flex items-end gap-4">
        <Input
          id="price"
          type="number"
          label="Цена, ₽"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={priceOnRequest}
          min={0}
        />
        <label className="flex items-center gap-2 text-sm text-ink-soft pb-2.5">
          <input
            type="checkbox"
            checked={priceOnRequest}
            onChange={(e) => setPriceOnRequest(e.target.checked)}
            className="h-4 w-4 accent-brass"
          />
          Цена по запросу
        </label>
      </div>

      <div className="flex gap-6">
        <Select
          id="status"
          label="Статус"
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          className="w-40"
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликован</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-ink-soft self-end pb-2.5">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-4 w-4 accent-brass"
          />
          Показывать на сайте
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Сохраняем…" : product ? "Сохранить изменения" : "Создать товар"}
        </Button>
      </div>
    </form>
  );
}
