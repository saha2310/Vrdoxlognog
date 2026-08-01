import { z } from "zod";

export const widgetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Название должно быть не короче 2 символов")
    .max(100, "Название слишком длинное"),
  category_ids: z.array(z.string().uuid()).default([]),
  sort_order: z.coerce.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export type WidgetInput = z.infer<typeof widgetSchema>;

export const widgetUpdateSchema = widgetSchema.and(z.object({ id: z.string().uuid() }));

export type WidgetUpdateInput = z.infer<typeof widgetUpdateSchema>;
