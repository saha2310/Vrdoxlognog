import { getAllCategoriesAdmin } from "@/lib/queries";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();
  return <CategoriesManager initialCategories={categories} />;
}
