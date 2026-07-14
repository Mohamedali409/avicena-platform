import { RoleGuard } from "@/components/shared/RoleGuard";

// PatientLayout — sidebar/nav for the patient portal. Guarded to role=patient.
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="patient">
      <div className="flex min-h-screen">
        <aside className="w-60 border-l bg-gray-50 p-4">
          <nav className="space-y-2 text-sm">
            <a href="/patient/dashboard">لوحة التحكم</a>
            <a href="/patient/appointments">مواعيدي</a>
            <a href="/patient/consultations">الاستشارات</a>
            <a href="/patient/reports">تقاريري</a>
            <a href="/patient/chat">المحادثات</a>
            <a href="/patient/subscriptions">الاشتراك</a>
            <a href="/patient/profile">الملف الشخصي</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
