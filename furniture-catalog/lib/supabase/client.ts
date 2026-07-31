import { createBrowserClient } from "@supabase/ssr";

// Браузерный клиент — использует anon key, только SELECT-запросы
// (write-операции идут через Server Actions с service role).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
