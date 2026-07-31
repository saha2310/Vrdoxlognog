import Link from "next/link";
import type { ContactsContent, ProductWithRelations } from "@/lib/types";

export function ProductInfo({
  product,
  contacts,
}: {
  product: ProductWithRelations;
  contacts: ContactsContent;
}) {
  const priceLabel =
    product.price_on_request || !product.price
      ? "Цена по запросу"
      : `${new Intl.NumberFormat("ru-RU").format(product.price)} ₽`;

  const contactHref = contacts.whatsapp
    ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`
    : contacts.phone
    ? `tel:${contacts.phone}`
    : contacts.email
    ? `mailto:${contacts.email}`
    : "/contacts";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/catalog?category=${product.category.slug}`}
          className="text-xs uppercase tracking-wide text-brass-deep"
        >
          {product.category.name}
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-ink mt-1">{product.title}</h1>
        <p className="mt-3 text-xl text-ink-soft">{priceLabel}</p>
      </div>

      {product.description && (
        <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-line">
          {product.description}
        </p>
      )}

      <a
        href={contactHref}
        target={contacts.whatsapp ? "_blank" : undefined}
        rel={contacts.whatsapp ? "noopener noreferrer" : undefined}
        className="inline-flex w-fit items-center justify-center rounded-sm bg-brass px-6 py-3 text-sm font-medium tracking-wide text-bone hover:bg-brass-deep transition-colors"
      >
        Связаться с мастером
      </a>

      <ProductDetails product={product} />
    </div>
  );
}

export function ProductDetails({ product }: { product: ProductWithRelations }) {
  const rows = [
    { label: "Материал", value: product.material },
    { label: "Размеры", value: product.dimensions },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {rows.map((row) => (
        <div key={row.label} className="spec-tag px-3 py-2">
          <span className="block text-[0.65rem] opacity-70">{row.label}</span>
          <span className="block mt-0.5 text-ink">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
