import { getWidgets, createWidget, deleteWidget } from '@/actions/widgets';
import { getCategories } from '@/actions/categories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AdminWidgetsPage() {
  const [widgets, categories] = await Promise.all([
    getWidgets(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Виджеты</h1>

      <form action={createWidget} className="bg-white p-6 rounded-2xl shadow mb-8 grid gap-4">
        <Input name="name" placeholder="Название виджета" required />
        <Input name="image" placeholder="URL изображения" />
        <Input name="sort_order" type="number" placeholder="Порядок" defaultValue="0" />
        <div>
          <div className="text-sm font-bold text-[#2c3e50] mb-2">Категории:</div>
          <div className="flex flex-wrap gap-3">
            {categories.map(c => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="category_ids" value={c.id} className="accent-[#e67e22]" />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_visible" defaultChecked className="w-5 h-5 accent-[#e67e22]" />
          <label>Видимый</label>
        </div>
        <Button type="submit" className="w-fit">Добавить виджет</Button>
      </form>

      <div className="grid gap-4">
        {widgets.map(w => (
          <div key={w.id} className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
            <div>
              <div className="font-bold text-lg text-[#2c3e50]">{w.name}</div>
              <div className="text-sm text-[#95a5a6] mt-1">Порядок: {w.sort_order}</div>
            </div>
            <form action={deleteWidget.bind(null, w.id)}>
              <Button variant="outline" className="text-red-500">Удалить</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
