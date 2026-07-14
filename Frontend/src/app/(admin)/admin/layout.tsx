import { RoleGuard } from "@/components/shared/RoleGuard";

// AdminLayout — operations console. Guarded to role=admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <div className="flex min-h-screen">
        <aside className="w-60 border-l bg-gray-50 p-4">
          <nav className="space-y-2 text-sm">
            <a href="/admin/dashboard">لوحة التحكم</a>
            <a href="/admin/doctors">الأطباء</a>
            <a href="/admin/users">المستخدمون</a>
            <a href="/admin/appointments">المواعيد</a>
            <a href="/admin/reports">التقارير</a>
            <a href="/admin/labs">المعامل</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
