'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { CartModal } from './cart-modal';

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const count = useCart(s => s.count());

  return (
    <>
      <header className="bg-gradient-to-r from-[#2c3e50] to-[#1a252f] text-white px-10 py-5 flex justify-between items-center sticky top-0 z-[100] shadow-[0_2px_20px_rgba(0,0,0,0.3)] max-md:px-5">
        <Link href="/" className="text-[28px] font-bold tracking-wide">Мебель<span className="text-[#e67e22]">Град</span></Link>
        <nav className="flex gap-6 max-md:hidden">
          <Link href="/" className="hover:text-[#e67e22] transition-colors">Главная</Link>
          <Link href="/catalog" className="hover:text-[#e67e22] transition-colors">Каталог</Link>
        </nav>
        <button onClick={() => setCartOpen(true)} className="bg-[#e67e22] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d35400] hover:scale-105 transition-all relative">
          🛒 Корзина
          {count > 0 && <span className="absolute -top-2 -right-2 bg-[#c0392b] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{count}</span>}
        </button>
      </header>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
