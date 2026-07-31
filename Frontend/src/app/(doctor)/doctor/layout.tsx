import { RoleGuard } from "@/components/shared/RoleGuard";
import { CallProvider } from "@/features/video/CallProvider";
import { PortalSidebar } from "@/components/shared/PortalSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

const NAV = [
  { href: "/doctor/dashboard", label: "لوحة التحكم", icon: "space_dashboard" },
  { href: "/doctor/appointments", label: "المواعيد", icon: "calendar_month" },
  { href: "/doctor/patients", label: "المرضى", icon: "groups" },
  { href: "/doctor/reports", label: "التقارير", icon: "description" },
  { href: "/doctor/consultations", label: "الاستشارات", icon: "clinical_notes" },
  { href: "/doctor/chat", label: "المحادثات + AI", icon: "forum" },
  { href: "/doctor/settings", label: "الإعدادات", icon: "settings" },
];

// DoctorLayout — the doctor workspace. Guarded to role=doctor.
// CallProvider mounts the single video-call controller so incoming calls ring
// anywhere in the workspace and startCall is available to any page.
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="doctor">
      <CallProvider>
        <div className="flex min-h-screen bg-background">
          <PortalSidebar
            brand={{ icon: "health_and_safety", label: "ابن سينا" }}
            user={{ icon: "stethoscope", roleLabel: "طبيب" }}
            nav={NAV}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <PortalHeader />
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </div>
      </CallProvider>
    </RoleGuard>
  );
}
