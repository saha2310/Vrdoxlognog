import { getSiteContent } from "@/lib/queries";
import type { ContactsContent } from "@/lib/types";

export const metadata = {
  title: "Контакты — Мебельная мастерская",
};

const ROWS: { key: keyof ContactsContent; label: string; href?: (v: string) => string }[] = [
  { key: "phone", label: "Телефон", href: (v) => `tel:${v}` },
  { key: "whatsapp", label: "WhatsApp", href: (v) => `https://wa.me/${v.replace(/\D/g, "")}` },
  { key: "telegram", label: "Telegram", href: (v) => `https://t.me/${v.replace(/^@/, "")}` },
  { key: "email", label: "Email", href: (v) => `mailto:${v}` },
  { key: "address", label: "Адрес" },
  { key: "workingHours", label: "Часы работы" },
];

export default async function ContactsPage() {
  const contacts = await getSiteContent<ContactsContent>("contacts");

  return (
    <div className="container-page py-12 md:py-16 max-w-xl">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Контакты</h1>
      <dl className="flex flex-col divide-y divide-line border-t border-b border-line">
        {ROWS.filter((row) => contacts[row.key]).map((row) => (
          <div key={row.key} className="flex justify-between gap-4 py-4">
            <dt className="text-sm text-ink-soft">{row.label}</dt>
            <dd className="text-sm text-ink text-right">
              {row.href ? (
                <a
                  href={row.href(contacts[row.key] as string)}
                  target={row.key === "whatsapp" || row.key === "telegram" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="hover:text-brass-deep"
                >
                  {contacts[row.key]}
                </a>
              ) : (
                contacts[row.key]
              )}
            </dd>
          </div>
        ))}
      </dl>
      {contacts.mapUrl && (
        <div className="corner-marks mt-8 aspect-video overflow-hidden">
          <iframe src={contacts.mapUrl} className="h-full w-full border-0" loading="lazy" title="Карта" />
        </div>
      )}
    </div>
  );
}
