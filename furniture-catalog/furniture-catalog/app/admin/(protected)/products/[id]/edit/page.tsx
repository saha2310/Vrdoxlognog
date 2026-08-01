import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getAllCategoriesAdmin } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ImageSorter } from "@/components/admin/ImageSorter";
import type { Product, ProductImage } from "@/lib/types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: product }, { data: images }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
    getAllCategoriesAdmin(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink">Редактирование: {product.title}</h1>
      </div>

      <ProductForm product={product as Product} categories={categories} />

      <div className="max-w-2xl flex flex-col gap-4 border-t border-line pt-8">
        <h2 className="font-display text-xl text-ink">Фотографии</h2>
        <ImageSorter productId={product.id} images={(images as ProductImage[]) ?? []} />
        <ImageUploader productId={product.id} currentCount={images?.length ?? 0} />
      </div>
    </div>
  );
}
