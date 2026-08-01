"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdmin } from "@/lib/supabase/server";
import { categorySchema, categoryUpdateSchema } from "@/lib/validators/category";
import { slugify, slugWithSuffix } from "@/lib/slug";
import type { ActionResult, Category } from "@/lib/types";

function denied(): ActionResult<never> {
  return { success: false, error: { code: "FORBIDDEN", message: "Доступ запрещён" } };
}

async function uniqueCategorySlug(base: string, excludeId?: string): Promise<string> {
  const supabase = createAdminClient();
  let slug = base;

  for (let attempt = 0; attempt < 5; attempt++) {
    let query = supabase.from("categories").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = slugWithSuffix(base);
  }
  return slug;
}

export async function createCategory(formData: unknown): Promise<ActionResult<Category>> {
  if (!(await isAdmin())) return denied();

  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const slug = await uniqueCategorySlug(slugify(parsed.data.name));

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...parsed.data, slug })
    .select()
    .single();

  if (error) {
    const code = error.code === "23505" ? "DUPLICATE" : "DB_ERROR";
    const message = error.code === "23505" ? "Категория с таким названием уже существует" : error.message;
    return { success: false, error: { code, message } };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { success: true, data };
}

export async function updateCategory(formData: unknown): Promise<ActionResult<Category>> {
  if (!(await isAdmin())) return denied();

  const parsed = categoryUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const { id, ...rest } = parsed.data;

  const { data: existing } = await supabase.from("categories").select("name, slug").eq("id", id).single();
  let slug = existing?.slug;
  if (existing && existing.name !== rest.name) {
    slug = await uniqueCategorySlug(slugify(rest.name), id);
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ ...rest, slug })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { success: true, data };
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      success: false,
      error: {
        code: "HAS_PRODUCTS",
        message: `Нельзя удалить категорию: в ней ${count} товар(ов). Сначала перенесите или удалите их.`,
      },
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { success: true, data: null };
}
