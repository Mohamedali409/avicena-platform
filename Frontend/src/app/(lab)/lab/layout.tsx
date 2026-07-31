import { RoleGuard } from "@/components/shared/RoleGuard";
import { PortalSidebar } from "@/components/shared/PortalSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

const NAV = [
  { href: "/lab/dashboard", label: "لوحة التحكم", icon: "space_dashboard" },
  { href: "/lab/profile", label: "ملف المعمل", icon: "biotech" },
  { href: "/lab/tests", label: "قائمة التحاليل", icon: "labs" },
];

// LabLayout — lab self-service. Guarded to role=lab.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="lab">
      <div className="flex min-h-screen bg-background">
        <PortalSidebar
          brand={{ icon: "biotech", label: "المعمل" }}
          user={{ icon: "biotech", roleLabel: "معمل تحاليل" }}
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
