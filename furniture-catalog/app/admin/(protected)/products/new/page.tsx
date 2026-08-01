import { getAllCategoriesAdmin } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl md:text-3xl text-ink">Новый товар</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
