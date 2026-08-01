'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validations';

export async function getProducts(filters?: {
  category?: string; minPrice?: number; maxPrice?: number;
  color?: string; discount?: boolean; isNew?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase.from('products').select('*, categories(*)').eq('is_active', true);

  if (filters?.category) query = query.eq('category_id', filters.category);
  if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  if (filters?.color) query = query.eq('color', filters.color);
  if (filters?.discount) query = query.not('old_price', 'is', null);
  if (filters?.isNew) query = query.eq('is_new', true);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*, categories(*)').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse({
    ...raw,
    is_new: raw.is_new === 'on',
    is_active: raw.is_active === 'on',
  });
  const { error } = await supabase.from('products').insert(parsed);
  if (error) throw error;
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse({
    ...raw,
    is_new: raw.is_new === 'on',
    is_active: raw.is_active === 'on',
  });
  const { error } = await supabase.from('products').update(parsed).eq('id', id);
  if (error) throw error;
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
}
