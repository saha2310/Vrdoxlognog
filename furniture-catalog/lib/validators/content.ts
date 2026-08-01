import { z } from "zod";

export const settingsSchema = z.object({
  companyName: z.string().trim().max(200).default(""),
  heroTitle: z.string().trim().max(200).default(""),
  heroSubtitle: z.string().trim().max(400).default(""),
  heroButtonText: z.string().trim().max(100).default(""),
  heroButtonLink: z.string().trim().max(300).default(""),
  productsOnHome: z.coerce.number().int().min(1).max(24).default(4),
});

export const contactsSchema = z.object({
  phone: z.string().trim().max(50).default(""),
  whatsapp: z.string().trim().max(50).default(""),
  telegram: z.string().trim().max(100).default(""),
  email: z.string().trim().max(200).default(""),
  address: z.string().trim().max(400).default(""),
  workingHours: z.string().trim().max(200).default(""),
  mapUrl: z.string().trim().max(500).default(""),
});

export const aboutSchema = z.object({
  content: z.string().trim().max(10000).default(""),
});

// 'home' — свободная JSON-структура, специфичной валидации пока нет
export const homeSchema = z.record(z.string(), z.unknown());

export const contentSchemas = {
  settings: settingsSchema,
  contacts: contactsSchema,
  about: aboutSchema,
  home: homeSchema,
} as const;

export type SettingsInput = z.infer<typeof settingsSchema>;
export type ContactsInput = z.infer<typeof contactsSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
