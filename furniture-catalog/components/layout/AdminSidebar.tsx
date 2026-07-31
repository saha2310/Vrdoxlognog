"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/content/about", label: "О нас" },
  { href: "/admin/content/contacts", label: "Контакты" },
  { href: "/admin/content/settings", label: "Настройки" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 flex flex-col gap-1 p-4">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-sm px-3 py-2 text-sm transition-colors ${
              active ? "bg-brass text-bone" : "text-ink-soft hover:bg-brass/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Мобильная верхняя панель с бургер-меню */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-line bg-bone-dim">
        <Link href="/admin" className="font-display text-lg text-ink">
          Админ-панель
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="block h-px w-5 bg-ink" />
          <span className="block h-px w-5 bg-ink" />
          <span className="block h-px w-5 bg-ink" />
        </button>
      </div>

      {/* Выдвижное меню на мобильных */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-bone-dim border-r border-line flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-line">
              <span className="font-display text-lg text-ink">Админ-панель</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="h-9 w-9 flex items-center justify-center text-xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="p-4 border-t border-line">
              <button
                onClick={handleLogout}
                className="w-full text-left rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
              >
                Выйти
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Постоянный сайдбар на десктопе */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-line bg-bone-dim min-h-screen flex-col">
        <div className="h-20 flex items-center px-6 border-b border-line">
          <Link href="/admin" className="font-display text-lg text-ink">
            Админ-панель
          </Link>
        </div>
        <NavLinks pathname={pathname} />
        <div className="p-4 border-t border-line">
          <button
            onClick={handleLogout}
            className="w-full text-left rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
          >
            Выйти
          </button>
        </div>
      </aside>
    </>
  );
}
