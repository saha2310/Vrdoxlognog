import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { createProduct, deleteProduct } from '@/actions/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Товары</h1>

      <form action={createProduct} className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Input name="name" placeholder="Название" required />
        <Input name="slug" placeholder="slug (латиница)" required />
        <Input name="price" type="number" placeholder="Цена" required />
        <Input name="old_price" type="number" placeholder="Старая цена" />
        <select name="category_id" className="w-full px-3 py-2 border-2 border-[#ddd] rounded-lg">
          <option value="">Без категории</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Input name="color" placeholder="Цвет" />
        <Input name="image" placeholder="URL изображения" />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2"><input type="checkbox" name="is_new" /> Новинка</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked /> Активен</label>
        </div>
        <textarea name="description" placeholder="Описание" className="col-span-2 w-full px-3 py-2 border-2 border-[#ddd] rounded-lg max-md:col-span-1" rows={3} />
        <Button type="submit" className="col-span-2 max-md:col-span-1">Добавить товар</Button>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="text-left p-4">Название</th>
              <th className="text-left p-4">Цена</th>
              <th className="text-left p-4">Категория</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-[#eee]">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.price.toLocaleString()} ₽</td>
                <td className="p-4">{p.categories?.name || '—'}</td>
                <td className="p-4">
                  <form action={deleteProduct.bind(null, p.id)}>
                    <Button variant="outline" className="text-red-500 hover:border-red-500">Удалить</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
