import { getCategories } from '@/actions/categories';
import { createCategory, deleteCategory } from '@/actions/categories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Категории</h1>

      <form action={createCategory} className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        <Input name="name" placeholder="Название" required />
        <Input name="slug" placeholder="slug" required />
        <Input name="image" placeholder="URL изображения" />
        <Input name="sort_order" type="number" placeholder="Порядок" defaultValue="0" />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked className="w-5 h-5 accent-[#e67e22]" />
          <label>Активна</label>
        </div>
        <Button type="submit">Добавить</Button>
      </form>

      <div className="bg-white rounded-2xl shadow">
        {categories.map(c => (
          <div key={c.id} className="flex justify-between items-center p-4 border-b border-[#eee] last:border-0">
            <div>
              <div className="font-bold text-[#2c3e50]">{c.name}</div>
              <div className="text-sm text-[#95a5a6]">/{c.slug}</div>
            </div>
            <form action={deleteCategory.bind(null, c.id)}>
              <Button variant="outline" className="text-red-500">Удалить</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
