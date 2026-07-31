import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware уже защищает эти маршруты, но проверяем ещё раз на уровне layout
  // как защиту в глубину (defense in depth) для Server Components/Actions.
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-bone">
        <div className="p-6 md:p-10 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
