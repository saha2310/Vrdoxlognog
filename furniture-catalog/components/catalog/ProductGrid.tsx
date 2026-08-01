import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/Feedback";
import type { ProductWithRelations } from "@/lib/types";

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Ничего не найдено"
        description="Попробуйте изменить фильтр по категории или условия поиска."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
