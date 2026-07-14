import { RoleGuard } from "@/components/shared/RoleGuard";

// LabLayout — lab self-service. Guarded to role=lab.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="lab">
      <div className="flex min-h-screen">
        <aside className="w-60 border-l bg-gray-50 p-4">
          <nav className="space-y-2 text-sm">
            <a href="/lab/profile">ملف المعمل</a>
            <a href="/lab/tests">قائمة التحاليل</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGuard>
  );
}
