import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { CatalogFilters } from '@/components/catalog-filters';
import { ProductCard } from '@/components/product-card';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  const filters = {
    category: Array.isArray(params.category) ? params.category[0] : params.category,
    minPrice: params.min ? parseInt(params.min as string) : undefined,
    maxPrice: params.max ? parseInt(params.max as string) : undefined,
    color: Array.isArray(params.color) ? params.color[0] : params.color,
    discount: params.discount === '1',
  };

  const products = await getProducts(filters);

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10 flex gap-8 max-md:flex-col">
      <CatalogFilters categories={categories} />

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="text-[#666]">Найдено товаров: <strong className="text-[#2c3e50]">{products.length}</strong></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-[#95a5a6] text-lg">
            😕 По вашему запросу ничего не найдено<br/>Попробуйте изменить фильтры
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
