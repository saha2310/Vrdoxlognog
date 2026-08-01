import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  old_price: z.coerce.number().min(0).optional().nullable().transform(v => v || null),
  category_id: z.string().uuid().optional().nullable().transform(v => v || null),
  color: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const widgetSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  category_ids: z.array(z.string().uuid()).default([]),
  sort_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
});
