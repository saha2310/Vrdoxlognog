import Link from "next/link";
import Image from "next/image";
import { getLatestPublishedProducts, getSiteContent } from "@/lib/queries";
import { getCoverImage, getStorageUrl } from "@/lib/storage";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import type { AboutContent, ContactsContent, SettingsContent } from "@/lib/types";

export default async function HomePage() {
  const settings = await getSiteContent<SettingsContent>("settings");
  const [products, about, contacts] = await Promise.all([
    getLatestPublishedProducts(settings.productsOnHome || 4),
    getSiteContent<AboutContent>("about"),
    getSiteContent<ContactsContent>("contacts"),
  ]);

  const heroCover = products[0] ? getCoverImage(products[0].images) : undefined;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container-page grid gap-10 py-16 md:py-24 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-6">
          <span className="spec-tag inline-block w-fit px-3 py-1">Мебель ручной работы</span>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.1] text-ink">
            {settings.heroTitle || "Мебель, сделанная по меркам вашего дома"}
          </h1>
          <p className="text-ink-soft text-base md:text-lg max-w-md">
            {settings.heroSubtitle ||
              "Проектируем и собираем мебель из массива дерева — от эскиза до установки."}
          </p>
          <ButtonLink href={settings.heroButtonLink || "/catalog"} className="w-fit">
            {settings.heroButtonText || "Смотреть каталог"}
          </ButtonLink>
        </div>
        <div className="corner-marks relative aspect-[4/5] bg-bone-dim overflow-hidden">
          {heroCover ? (
            <Image
              src={getStorageUrl(heroCover.storage_path)}
              alt={products[0].title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-soft/40 text-sm">
              Фото появится после публикации первого товара
            </div>
          )}
        </div>
      </section>

      {/* Новинки */}
      {products.length > 0 && (
        <section className="container-page py-12 md:py-16 border-t border-line">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-ink">Новинки</h2>
            <Link href="/catalog" className="text-sm text-brass-deep hover:underline">
              Весь каталог →
            </Link>
          </div>
          <ProductGrid products={products} />
        </section>
      )}

      {/* О нас, кратко */}
      {about.content && (
        <section className="container-page py-12 md:py-16 border-t border-line grid gap-6 md:grid-cols-2">
          <h2 className="font-display text-2xl md:text-3xl text-ink">О мастерской</h2>
          <p className="text-ink-soft leading-relaxed whitespace-pre-line">
            {about.content.length > 400 ? `${about.content.slice(0, 400)}…` : about.content}
          </p>
        </section>
      )}

      {/* Контакты, кратко */}
      <section className="container-page py-12 md:py-16 border-t border-line">
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">Свяжитесь с нами</h2>
        <div className="flex flex-wrap gap-x-10 gap-y-2 text-ink-soft">
          {contacts.phone && <a href={`tel:${contacts.phone}`} className="hover:text-brass-deep">{contacts.phone}</a>}
          {contacts.email && <a href={`mailto:${contacts.email}`} className="hover:text-brass-deep">{contacts.email}</a>}
          {contacts.address && <span>{contacts.address}</span>}
        </div>
      </section>
    </div>
  );
}
