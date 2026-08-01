import { NextResponse, type NextRequest } from "next/server";

// Оптимистичная проверка на уровне Proxy (Next.js 16 переименовал Middleware в Proxy,
// функциональность та же). Proxy выполняется на каждом запросе, включая prefetch,
// поэтому здесь допустима только лёгкая проверка по cookie — без похода в Supabase/БД.
// Полноценная проверка прав (isAdmin() → supabase.auth.getUser()) выполняется в
// app/admin/(protected)/layout.tsx и повторно в каждом Server Action — это и есть
// основной рубеж защиты (Data Access Layer), Proxy лишь ускоряет редирект неавторизованных.
function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => /^sb-.*-auth-token/.test(cookie.name));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  const hasSession = hasSupabaseSessionCookie(request);

  if (isAdminRoute && !isLoginPage && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
