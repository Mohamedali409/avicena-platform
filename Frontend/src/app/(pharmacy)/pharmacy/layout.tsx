import { RoleGuard } from "@/components/shared/RoleGuard";
import { PortalSidebar } from "@/components/shared/PortalSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

const NAV = [
  { href: "/pharmacy/dashboard", label: "لوحة التحكم", icon: "space_dashboard" },
  { href: "/pharmacy/inventory", label: "المخزون", icon: "inventory_2" },
  { href: "/pharmacy/orders", label: "الطلبات", icon: "receipt_long" },
  { href: "/pharmacy/profile", label: "ملف الصيدلية", icon: "local_pharmacy" },
];

// PharmacyLayout — pharmacy owner self-service. Guarded to role=pharmacy.
export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="pharmacy">
      <div className="flex min-h-screen bg-background">
        <PortalSidebar
          brand={{ icon: "local_pharmacy", label: "الصيدلية" }}
          user={{ icon: "local_pharmacy", roleLabel: "صيدلية" }}
          nav={NAV}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
