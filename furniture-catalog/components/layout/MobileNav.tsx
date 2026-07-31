"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 cursor-pointer"
      >
        <span className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
        <span className={`block h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-20 border-b border-line bg-bone px-5 py-4 flex flex-col gap-1 shadow-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm tracking-wide text-ink-soft hover:text-brass-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
