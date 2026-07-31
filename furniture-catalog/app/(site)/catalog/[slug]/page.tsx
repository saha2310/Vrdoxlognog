import { notFound } from "next/navigation";
import { getProductBySlug, getSiteContent } from "@/lib/queries";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import type { ContactsContent } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.title} — Мебельная мастерская`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, contacts] = await Promise.all([
    getProductBySlug(slug),
    getSiteContent<ContactsContent>("contacts"),
  ]);

  if (!product) notFound();

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />
        <ProductInfo product={product} contacts={contacts} />
      </div>
    </div>
  );
}
