import { RoleGuard } from "@/components/shared/RoleGuard";
import { CallProvider } from "@/features/video/CallProvider";
import { PortalSidebar } from "@/components/shared/PortalSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

const NAV = [
  { href: "/patient/dashboard", label: "لوحة التحكم", icon: "space_dashboard" },
  { href: "/patient/appointments", label: "مواعيدي", icon: "calendar_month" },
  { href: "/patient/consultations", label: "الاستشارات", icon: "clinical_notes" },
  { href: "/patient/reports", label: "تقاريري", icon: "description" },
  { href: "/patient/chat", label: "المحادثات", icon: "forum" },
  { href: "/patient/subscriptions", label: "الاشتراك", icon: "workspace_premium" },
  { href: "/patient/profile", label: "الملف الشخصي", icon: "person" },
];

// PatientLayout — sidebar/nav for the patient portal. Guarded to role=patient.
// CallProvider mounts the single video-call controller so incoming calls ring
// anywhere in the portal and startCall is available to any page.
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="patient">
      <CallProvider>
        <div className="flex min-h-screen bg-background">
          <PortalSidebar
            brand={{ icon: "health_and_safety", label: "ابن سينا" }}
            user={{ icon: "person", roleLabel: "مريض" }}
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
