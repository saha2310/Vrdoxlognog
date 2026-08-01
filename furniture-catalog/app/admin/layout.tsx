import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="bg-[#2c3e50] text-white px-8 py-4 flex gap-6">
        <Link href="/admin/products" className="hover:text-[#e67e22]">Товары</Link>
        <Link href="/admin/categories" className="hover:text-[#e67e22]">Категории</Link>
        <Link href="/admin/widgets" className="hover:text-[#e67e22]">Виджеты</Link>
        <Link href="/" className="ml-auto hover:text-[#e67e22]">← На сайт</Link>
      </div>
      <div className="p-8 max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
