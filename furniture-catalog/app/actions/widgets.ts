"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, isAdmin } from "@/lib/supabase/server";
import { widgetSchema, widgetUpdateSchema } from "@/lib/validators/widget";
import type { ActionResult, Widget } from "@/lib/types";

function denied(): ActionResult<never> {
  return { success: false, error: { code: "FORBIDDEN", message: "Доступ запрещён" } };
}

export async function createWidget(formData: unknown): Promise<ActionResult<Widget>> {
  if (!(await isAdmin())) return denied();

  const parsed = widgetSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("widgets").insert(parsed.data).select().single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/widgets");
  return { success: true, data };
}

export async function updateWidget(formData: unknown): Promise<ActionResult<Widget>> {
  if (!(await isAdmin())) return denied();

  const parsed = widgetUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
    };
  }

  const supabase = createAdminClient();
  const { id, ...rest } = parsed.data;

  const { data, error } = await supabase.from("widgets").update(rest).eq("id", id).select().single();

  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/widgets");
  return { success: true, data };
}

export async function deleteWidget(id: string): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { data: widget } = await supabase
    .from("widgets")
    .select("image_storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("widgets").delete().eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  if (widget?.image_storage_path) {
    await supabase.storage.from("product-images").remove([widget.image_storage_path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/widgets");
  return { success: true, data: null };
}

export async function setWidgetVisibility(id: string, is_visible: boolean): Promise<ActionResult<null>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();
  const { error } = await supabase.from("widgets").update({ is_visible }).eq("id", id);
  if (error) {
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  revalidatePath("/");
  revalidatePath("/admin/widgets");
  return { success: true, data: null };
}

// Виджет — одна картинка, при повторной загрузке заменяет предыдущую
// (используем тот же bucket product-images, отдельный префикс widgets/).
export async function uploadWidgetImage(widgetId: string, file: File): Promise<ActionResult<Widget>> {
  if (!(await isAdmin())) return denied();

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("widgets")
    .select("image_storage_path")
    .eq("id", widgetId)
    .maybeSingle();

  const ext = file.name.split(".").pop() || "jpg";
  const path = `widgets/${widgetId}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { success: false, error: { code: "STORAGE_ERROR", message: uploadError.message } };
  }

  const { data, error } = await supabase
    .from("widgets")
    .update({ image_storage_path: path })
    .eq("id", widgetId)
    .select()
    .single();

  if (error) {
    await supabase.storage.from("product-images").remove([path]);
    return { success: false, error: { code: "DB_ERROR", message: error.message } };
  }

  if (existing?.image_storage_path) {
    await supabase.storage.from("product-images").remove([existing.image_storage_path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/widgets");
  revalidatePath(`/admin/widgets/${widgetId}/edit`);
  return { success: true, data };
}
