import { RoleGuard } from "@/components/shared/RoleGuard";
import { PortalSidebar } from "@/components/shared/PortalSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

const NAV = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: "space_dashboard" },
  { href: "/admin/doctors", label: "الأطباء", icon: "stethoscope" },
  { href: "/admin/users", label: "المستخدمون", icon: "groups" },
  { href: "/admin/appointments", label: "المواعيد", icon: "calendar_month" },
  { href: "/admin/reports", label: "التقارير", icon: "description" },
  { href: "/admin/labs", label: "المعامل", icon: "biotech" },
  { href: "/admin/pharmacies", label: "الصيدليات", icon: "local_pharmacy" },
];

// AdminLayout — operations console. Guarded to role=admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <div className="flex min-h-screen bg-background">
        <PortalSidebar
          brand={{ icon: "admin_panel_settings", label: "لوحة الإدارة" }}
          nav={NAV}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader showBell={false} />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
