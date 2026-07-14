import { RoleGuard } from "@/components/shared/RoleGuard";

// DoctorLayout — the doctor workspace. Guarded to role=doctor.
// The chat route embeds the Medical-AI side panel (doctor-only RAG assistant).
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="doctor">
      <div className="flex min-h-screen">
        <aside className="w-60 border-l bg-gray-50 p-4">
          <nav className="space-y-2 text-sm">
            <a href="/doctor/dashboard">لوحة التحكم</a>
            <a href="/doctor/appointments">المواعيد</a>
            <a href="/doctor/patients">المرضى</a>
            <a href="/doctor/reports">التقارير</a>
            <a href="/doctor/consultations">الاستشارات</a>
            <a href="/doctor/chat">المحادثات + مساعد AI</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
