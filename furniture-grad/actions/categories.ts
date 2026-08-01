'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validations';

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = categorySchema.parse({ ...raw, is_active: raw.is_active === 'on' });
  const { error } = await supabase.from('categories').insert(parsed);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const parsed = categorySchema.parse({ ...raw, is_active: raw.is_active === 'on' });
  const { error } = await supabase.from('categories').update(parsed).eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/categories');
}
