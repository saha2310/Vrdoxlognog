import Link from 'next/link';
import { Category } from '@/lib/types';

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link 
      href={`/catalog?category=${category.id}`}
      className="relative rounded-2xl overflow-hidden h-48 group shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300"
    >
      <img 
        src={category.image || '/placeholder.jpg'} 
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <h3 className="text-white text-xl font-bold">{category.name}</h3>
      </div>
    </Link>
  );
}
