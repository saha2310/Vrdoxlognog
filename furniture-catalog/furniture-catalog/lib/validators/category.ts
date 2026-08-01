import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Название должно быть не короче 2 символов")
    .max(100, "Название слишком длинное"),
  sort_order: z.coerce.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryUpdateSchema = categorySchema.and(
  z.object({ id: z.string().uuid() })
);

export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
