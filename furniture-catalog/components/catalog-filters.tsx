'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';

const COLORS = [
  { value: 'white', label: 'Белый' },
  { value: 'wood', label: 'Дерево' },
  { value: 'gray', label: 'Серый' },
  { value: 'black', label: 'Чёрный' },
  { value: 'brown', label: 'Коричневый' },
];

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    return params.toString();
  }, [searchParams]);

  const toggleParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(name);
    if (current.includes(value)) {
      params.delete(name);
      current.filter(v => v !== value).forEach(v => params.append(name, v));
    } else {
      params.append(name, value);
    }
    router.push(`/catalog?${params.toString()}`);
  };

  const isChecked = (name: string, value: string) => {
    return searchParams.getAll(name).includes(value);
  };

  const reset = () => router.push('/catalog');

  return (
    <aside className="w-[280px] shrink-0 max-md:w-full">
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] sticky top-24">
        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">🏷️ Категории</h3>
          {categories.map(cat => (
            <Checkbox 
              key={cat.id}
              label={cat.name}
              checked={isChecked('category', cat.id)}
              onChange={() => toggleParam('category', cat.id)}
            />
          ))}
        </div>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">💰 Цена</h3>
          <div className="flex gap-2.5 items-center">
            <Input 
              type="number" 
              placeholder="От" 
              className="w-full"
              defaultValue={searchParams.get('min') || ''}
              onChange={e => router.push(`/catalog?${createQueryString('min', e.target.value)}`)}
            />
            <span className="text-[#95a5a6]">—</span>
            <Input 
              type="number" 
              placeholder="До" 
              className="w-full"
              defaultValue={searchParams.get('max') || ''}
              onChange={e => router.push(`/catalog?${createQueryString('max', e.target.value)}`)}
            />
          </div>
        </div>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">🎨 Цвет</h3>
          {COLORS.map(c => (
            <Checkbox 
              key={c.value}
              label={c.label}
              checked={isChecked('color', c.value)}
              onChange={() => toggleParam('color', c.value)}
            />
          ))}
        </div>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">⭐ Скидки</h3>
          <Checkbox 
            label="Только со скидкой"
            checked={searchParams.has('discount')}
            onChange={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (params.has('discount')) params.delete('discount');
              else params.set('discount', '1');
              router.push(`/catalog?${params.toString()}`);
            }}
          />
        </div>

        <Button variant="secondary" className="w-full" onClick={reset}>
          Сбросить фильтры
        </Button>
      </div>
    </aside>
  );
}
