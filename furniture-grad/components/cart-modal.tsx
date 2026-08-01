'use client';
import { useCart } from '@/lib/cart-store';

export function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart, changeQty, total } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[20px] w-[90%] max-w-[600px] max-h-[80vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#eee] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#2c3e50]">🛒 Ваша корзина</h2>
          <button onClick={onClose} className="text-3xl text-[#95a5a6] hover:text-[#e74c3c] transition-colors">×</button>
        </div>
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-10 text-[#95a5a6] text-lg">🛒 Ваша корзина пуста<br/>Добавьте товары из каталога</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#f8f9fa] rounded-xl mb-4 items-center">
                <img src={item.image || ''} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="font-bold text-[#2c3e50] mb-1">{item.name}</div>
                  <div className="text-[#e67e22] font-bold">{item.price.toLocaleString()} ₽</div>
                  <div className="flex items-center gap-2.5 mt-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border-2 border-[#ddd] bg-white rounded-md font-bold hover:border-[#e67e22] hover:text-[#e67e22]">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border-2 border-[#ddd] bg-white rounded-md font-bold hover:border-[#e67e22] hover:text-[#e67e22]">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-[#e74c3c] text-lg p-1">🗑️</button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-[#eee] bg-[#f8f9fa]">
          <div className="flex justify-between text-[22px] font-extrabold text-[#2c3e50] mb-5">
            <span>Итого:</span><span>{total().toLocaleString()} ₽</span>
          </div>
          <button onClick={() => { alert('Заказ оформлен!'); useCart.setState({ items: [] }); onClose(); }} className="w-full py-4 bg-gradient-to-r from-[#e67e22] to-[#d35400] text-white rounded-xl text-lg font-bold hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(230,126,34,0.4)] transition-all">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}
