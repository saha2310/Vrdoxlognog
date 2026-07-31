import { z } from "zod";

export const productSchema = z
  .object({
    category_id: z.string().uuid({ message: "Выберите категорию" }),
    title: z
      .string()
      .trim()
      .min(2, "Название должно быть не короче 2 символов")
      .max(200, "Название слишком длинное"),
    description: z.string().trim().max(5000).optional().or(z.literal("")),
    material: z.string().trim().max(300).optional().or(z.literal("")),
    dimensions: z.string().trim().max(300).optional().or(z.literal("")),
    price: z
      .union([z.coerce.number().nonnegative("Цена не может быть отрицательной"), z.null()])
      .optional(),
    price_on_request: z.boolean().default(false),
    status: z.enum(["draft", "published"]).default("draft"),
    is_visible: z.boolean().default(true),
    sort_order: z.coerce.number().int().default(0),
  })
  .refine(
    (data) => data.price_on_request || data.price !== null && data.price !== undefined,
    {
      message: "Укажите цену или отметьте «Цена по запросу»",
      path: ["price"],
    }
  );

export type ProductInput = z.infer<typeof productSchema>;

export const productUpdateSchema = productSchema.and(
  z.object({ id: z.string().uuid() })
);

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
