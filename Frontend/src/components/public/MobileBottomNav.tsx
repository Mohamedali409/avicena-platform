import Link from "next/link";

// Mobile bottom navigation for public pages.
export function MobileBottomNav({ active }: { active?: "home" | "appointments" | "specialties" | "account" }) {
  const item = (key: string, icon: string, label: string, href: string, highlight?: boolean) => (
    <Link
      href={href}
      className={
        highlight
          ? "flex flex-col items-center justify-center rounded-full bg-primary-container px-4 py-1 text-on-primary-container"
          : `flex flex-col items-center justify-center p-2 ${active === key ? "text-primary" : "text-on-secondary-container"}`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-label-md">{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:hidden">
      {item("home", "home", "الرئيسية", "/")}
      {item("appointments", "calendar_today", "مواعيدي", "/login")}
      {item("specialties", "medical_services", "التخصصات", "/doctors", true)}
      {item("account", "person", "حسابي", "/login")}
    </nav>
  );
}
