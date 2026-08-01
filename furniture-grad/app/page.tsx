import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { getWidgets } from '@/actions/widgets';
import { CategoryTile } from '@/components/category-tile';
import { NewArrivals } from '@/components/new-arrivals';

export default async function HomePage() {
  const [categories, newProducts, widgets] = await Promise.all([
    getCategories(),
    getProducts({ isNew: true }),
    getWidgets(),
  ]);

  return (
    <>
      <section 
        className="relative h-[400px] flex items-center justify-center text-center text-white bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200)' }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg max-md:text-3xl">
            Создайте уют в своём доме
          </h1>
          <p className="text-xl opacity-90 max-md:text-base">
            Качественная мебель по доступным ценам с доставкой по всей стране
          </p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-[1400px] mx-auto">
        <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">📂 Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map(cat => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {widgets.map(widget => (
        <section key={widget.id} className="py-12 px-4 max-w-[1400px] mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            {widget.image && (
              <img src={widget.image} alt={widget.name} className="w-full h-64 object-cover" />
            )}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">{widget.name}</h2>
            </div>
          </div>
        </section>
      ))}

      <NewArrivals products={newProducts} />
    </>
  );
}
