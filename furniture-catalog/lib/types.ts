export type ProductStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string | null;
  material: string | null;
  dimensions: string | null;
  price: number | null;
  price_on_request: boolean;
  status: ProductStatus;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface ProductWithRelations extends Product {
  category: Category;
  images: ProductImage[];
}

export interface SettingsContent {
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  productsOnHome: number;
}

export interface ContactsContent {
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  address: string;
  workingHours: string;
  mapUrl: string;
}

export interface AboutContent {
  content: string;
}

// 'home' пока не имеет фиксированных полей — расширяется по мере необходимости
export type HomeContent = Record<string, unknown>;

export type SiteContentKey = "settings" | "contacts" | "about" | "home";

export interface SiteContentRow<T = Record<string, unknown>> {
  key: SiteContentKey;
  data: T;
  updated_at: string;
}

export interface Widget {
  id: string;
  title: string;
  image_storage_path: string | null;
  category_ids: string[];
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface WidgetWithCategories extends Widget {
  categories: Category[];
}

// Единый формат ответа Server Actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
