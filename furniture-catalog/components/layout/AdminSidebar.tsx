"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/content/home", label: "Главная" },
  { href: "/admin/content/about", label: "О нас" },
  { href: "/admin/content/contacts", label: "Контакты" },
  { href: "/admin/content/settings", label: "Настройки" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 border-r border-line bg-bone-dim min-h-screen flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-line">
        <Link href="/admin" className="font-display text-lg text-ink">
          Админ-панель
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-2 text-sm transition-colors ${
                active ? "bg-brass text-bone" : "text-ink-soft hover:bg-brass/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-line">
        <button
          onClick={handleLogout}
          className="w-full text-left rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
