"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdmin } from "@/lib/supabase/server";
import { contentSchemas } from "@/lib/validators/content";
import type { ActionResult, SiteContentKey } from "@/lib/types";

function denied(): ActionResult<never> {
  return { success: false, error: { code: "FORBIDDEN", message: "Доступ запрещён" } };
}

export async function updateSiteContent(
  key: SiteContentKey,
  data: unknown
): Promise<ActionResult<Record<string, unknown>>> {
  if (!(await isAdmin())) return denied();

  const schema = contentSchemas[key];
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const { data: updated, error } = await supabase
    .from("site_content")
    .update({ data: parsed.data, updated_at: new Date().toISOString() })
    .eq("key", key)
    .select("data")
    .single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contacts");
  revalidatePath(`/admin/content/${key}`);
  return { success: true, data: updated.data };
}

// Картинка баннера на главной ("home".heroImagePath). Хранится в том же bucket,
// что и фото товаров. Если не загружена — главная показывает фото последнего товара (запасной вариант).
export async function uploadHeroImage(file: File): Promise<ActionResult<{ heroImagePath: string }>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", "home")
    .maybeSingle();

  const previousPath = (existing?.data as { heroImagePath?: string } | null)?.heroImagePath;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `hero/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { success: false, error: { code: "STORAGE_ERROR", message: uploadError.message } };
  }

  const { error } = await supabase
    .from("site_content")
    .update({ data: { heroImagePath: path }, updated_at: new Date().toISOString() })
    .eq("key", "home");

  if (error) {
    await supabase.storage.from("product-images").remove([path]);
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  if (previousPath) {
    await supabase.storage.from("product-images").remove([previousPath]);
  }

  revalidatePath("/");
  revalidatePath("/admin/content/home");
  return { success: true, data: { heroImagePath: path } };
}

export async function removeHeroImage(): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", "home")
    .maybeSingle();

  const previousPath = (existing?.data as { heroImagePath?: string } | null)?.heroImagePath;

  const { error } = await supabase
    .from("site_content")
    .update({ data: {}, updated_at: new Date().toISOString() })
    .eq("key", "home");

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  if (previousPath) {
    await supabase.storage.from("product-images").remove([previousPath]);
  }

  revalidatePath("/");
  revalidatePath("/admin/content/home");
  return { success: true, data: null };
}
