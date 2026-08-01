'use client';
import { useRef } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

export function NewArrivals({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#2c3e50]">✨ Новинки</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full border-2 border-[#ddd] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition-colors"
          >
            ←
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full border-2 border-[#ddd] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition-colors"
          >
            →
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <div key={product.id} className="min-w-[300px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
