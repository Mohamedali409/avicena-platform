import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";

// Reusable "coming soon" scaffold for pages not yet backed by an API.
export function ComingSoon({ active, icon, title, subtitle }: { active?: string; icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <PublicHeader active={active} />
      <main className="flex flex-1 flex-col items-center justify-center px-margin-mobile py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container">
          <span className="material-symbols-outlined text-[44px]">{icon}</span>
        </div>
        <h1 className="mb-3 text-headline-lg text-on-surface">{title}</h1>
        <p className="mb-8 max-w-md text-body-md text-on-surface-variant">{subtitle}</p>
        <Link href="/" className="rounded-lg bg-primary-container px-8 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-95">
          العودة للرئيسية
        </Link>
      </main>
      <MobileBottomNav />
      <PublicFooter />
    </div>
  );
}
