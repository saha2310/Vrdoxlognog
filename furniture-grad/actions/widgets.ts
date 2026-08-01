'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { widgetSchema } from '@/lib/validations';

export async function getWidgets() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('widgets').select('*').eq('is_visible', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function createWidget(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const category_ids = formData.getAll('category_ids') as string[];
  const parsed = widgetSchema.parse({ ...raw, category_ids, is_visible: raw.is_visible === 'on' });
  const { error } = await supabase.from('widgets').insert(parsed);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/widgets');
}

export async function updateWidget(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData);
  const category_ids = formData.getAll('category_ids') as string[];
  const parsed = widgetSchema.parse({ ...raw, category_ids, is_visible: raw.is_visible === 'on' });
  const { error } = await supabase.from('widgets').update(parsed).eq('id', id);
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin/widgets');
}

export async function deleteWidget(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('widgets').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/widgets');
}
