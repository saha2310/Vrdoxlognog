'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';

interface CartItem extends Product { qty: number; }

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const items = get().items;
        const existing = items.find(i => i.id === product.id);
        if (existing) { existing.qty++; set({ items: [...items] }); }
        else { set({ items: [...items, { ...product, qty: 1 }] }); }
      },
      removeFromCart: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      changeQty: (id, delta) => {
        const items = get().items.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
        set({ items });
      },
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'furniture-cart' }
  )
);

export const addToCart = (product: Product) => useCart.getState().addToCart(product);
