import Link from "next/link";
import { getSiteContent } from "@/lib/queries";
import type { ContactsContent, SettingsContent } from "@/lib/types";

export async function Footer() {
  const [settings, contacts] = await Promise.all([
    getSiteContent<SettingsContent>("settings"),
    getSiteContent<ContactsContent>("contacts"),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-walnut text-bone">
      <div className="container-page py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">{settings.companyName || "Мастерская"}</p>
          <p className="mt-2 text-sm text-bone/70">
            Мебель ручной работы: столы, стулья, шкафы и другие изделия на заказ.
          </p>
        </div>
        <div className="text-sm text-bone/80 flex flex-col gap-1.5">
          {contacts.phone && <a href={`tel:${contacts.phone}`}>{contacts.phone}</a>}
          {contacts.email && <a href={`mailto:${contacts.email}`}>{contacts.email}</a>}
          {contacts.address && <p>{contacts.address}</p>}
          {contacts.workingHours && <p className="text-bone/60">{contacts.workingHours}</p>}
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <Link href="/catalog" className="text-bone/80 hover:text-bone">Каталог</Link>
          <Link href="/about" className="text-bone/80 hover:text-bone">О нас</Link>
          <Link href="/contacts" className="text-bone/80 hover:text-bone">Контакты</Link>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="container-page py-4 text-xs text-bone/50">
          © {year} {settings.companyName || "Мастерская"}
        </div>
      </div>
    </footer>
  );
}
