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
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-bone min-w-0">
        <div className="p-4 sm:p-6 md:p-10 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
