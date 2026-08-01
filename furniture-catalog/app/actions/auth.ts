"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function loginAdmin(
  email: string,
  password: string
): Promise<ActionResult<null>> {
  if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return {
      success: false,
      error: { code: "NOT_ADMIN", message: "Неверный email или пароль" },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      success: false,
      error: { code: "AUTH_ERROR", message: "Неверный email или пароль" },
    };
  }

  return { success: true, data: null };
}

export async function logoutAdmin(): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: { code: "AUTH_ERROR", message: error.message } };
  }

  return { success: true, data: null };
}
