import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Серверный клиент, привязанный к сессии пользователя (cookies).
// Используется для проверки авторизации администратора (Supabase Auth).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll вызван из Server Component — proxy.ts обновит сессию отдельно
          }
        },
      },
    }
  );
}

// Административный клиент с service role ключом.
// Обходит RLS. Использовать ТОЛЬКО в Server Actions / Route Handlers,
// никогда не импортировать в клиентский код.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Проверяет, что текущий пользователь — администратор.
// Возвращает true/false, не бросает исключение.
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return false;
  return user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}
