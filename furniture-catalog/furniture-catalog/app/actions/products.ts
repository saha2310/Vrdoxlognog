"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdmin } from "@/lib/supabase/server";
import { productSchema, productUpdateSchema } from "@/lib/validators/product";
import { slugify, slugWithSuffix } from "@/lib/slug";
import type { ActionResult, Product } from "@/lib/types";

function denied(): ActionResult<never> {
  return { success: false, error: { code: "FORBIDDEN", message: "Доступ запрещён" } };
}

async function uniqueProductSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = createAdminClient();
  let slug = base;

  for (let attempt = 0; attempt < 5; attempt++) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = slugWithSuffix(base);
  }
  return slug;
}

export async function createProduct(formData: unknown): Promise<ActionResult<Product>> {
  if (!(await isAdmin())) return denied();

  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const baseSlug = slugify(parsed.data.title);
  const slug = await uniqueProductSlug(baseSlug);

  const { data, error } = await supabase
    .from("products")
    .insert({ ...parsed.data, slug, description: parsed.data.description || null, material: parsed.data.material || null, dimensions: parsed.data.dimensions || null, price: parsed.data.price_on_request ? null : parsed.data.price })
    .select()
    .single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true, data };
}

export async function updateProduct(formData: unknown): Promise<ActionResult<Product>> {
  if (!(await isAdmin())) return denied();

  const parsed = productUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const { id, ...rest } = parsed.data;

  const { data: existing } = await supabase.from("products").select("title, slug").eq("id", id).single();
  let slug = existing?.slug;
  if (existing && existing.title !== rest.title) {
    slug = await uniqueProductSlug(slugify(rest.title), id);
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      ...rest,
      slug,
      description: rest.description || null,
      material: rest.material || null,
      dimensions: rest.dimensions || null,
      price: rest.price_on_request ? null : rest.price,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath(`/catalog/${slug}`);
  return { success: true, data };
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  // Забираем пути файлов, чтобы удалить их из Storage после удаления записей.
  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  if (images && images.length > 0) {
    await supabase.storage.from("product-images").remove(images.map((i) => i.storage_path));
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true, data: null };
}

export async function setProductStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true, data: null };
}

export async function setProductVisibility(
  id: string,
  is_visible: boolean
): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update({ is_visible }).eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true, data: null };
}
