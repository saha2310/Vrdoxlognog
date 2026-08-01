import Link from "next/link";
import { getSiteContent } from "@/lib/queries";
import { MobileNav } from "./MobileNav";
import type { SettingsContent } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

export async function Header() {
  const settings = await getSiteContent<SettingsContent>("settings");
  const companyName = settings.companyName || "Мастерская";

  return (
    <header className="relative border-b border-line bg-bone">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-xl text-ink">
          {companyName}
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-ink-soft hover:text-brass-deep transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
