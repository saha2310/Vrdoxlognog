"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdmin } from "@/lib/supabase/server";
import type { ActionResult, ProductImage } from "@/lib/types";

const MAX_IMAGES_PER_PRODUCT = 10;

function denied(): ActionResult<never> {
  return { success: false, error: { code: "FORBIDDEN", message: "Доступ запрещён" } };
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<ActionResult<ProductImage>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((count ?? 0) >= MAX_IMAGES_PER_PRODUCT) {
    return {
      success: false,
      error: { code: "LIMIT_REACHED", message: `Максимум ${MAX_IMAGES_PER_PRODUCT} изображений на товар` },
    };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { success: false, error: { code: "STORAGE_ERROR", message: uploadError.message } };
  }

  const isFirstImage = (count ?? 0) === 0;

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: path,
      sort_order: count ?? 0,
      is_cover: isFirstImage,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from("product-images").remove([path]);
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true, data };
}

export async function deleteProductImage(imageId: string): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!image) {
    return { success: false, error: { code: "NOT_FOUND", message: "Изображение не найдено" } };
  }

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  await supabase.storage.from("product-images").remove([image.storage_path]);

  // Если удалили обложку — назначаем обложкой первое оставшееся изображение
  if (image.is_cover) {
    const { data: remaining } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", image.product_id)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (remaining) {
      await supabase.from("product_images").update({ is_cover: true }).eq("id", remaining.id);
    }
  }

  revalidatePath(`/admin/products/${image.product_id}/edit`);
  return { success: true, data: null };
}

export async function setCoverImage(
  productId: string,
  imageId: string
): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  await supabase.from("product_images").update({ is_cover: false }).eq("product_id", productId);
  const { error } = await supabase
    .from("product_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true, data: null };
}

// orderedImageIds — массив id изображений в новом порядке (индекс = sort_order)
export async function reorderProductImages(
  productId: string,
  orderedImageIds: string[]
): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const updates = orderedImageIds.map((id, index) =>
    supabase.from("product_images").update({ sort_order: index }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { success: false, error: { code: "DB_ERROR", message: failed.error.message } };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true, data: null };
}
