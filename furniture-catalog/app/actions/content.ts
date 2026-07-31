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
