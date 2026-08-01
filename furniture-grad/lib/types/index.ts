export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category_id: string | null;
  color: string | null;
  image: string | null;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  categories?: Category | null;
}

export interface Widget {
  id: string;
  name: string;
  image: string | null;
  category_ids: string[];
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}
