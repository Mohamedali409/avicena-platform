"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountMenu } from "./AccountMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Shared nav — used across every public page (desktop + mobile).
const NAV = [
  { key: "home", label: "الرئيسية", href: "/" },
  { key: "doctors", label: "الأطباء", href: "/doctors" },
  { key: "labs", label: "المعامل", href: "/labs" },
  { key: "pharmacies", label: "الصيدليات", href: "/pharmacies" },
];

export function PublicHeader({ active }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const Logo = () => (
    <Link href="/" className="flex flex-shrink-0 items-center gap-2 text-primary">
      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
      <span className="text-[22px] font-bold tracking-tight">Avicena</span>
    </Link>
  );

  return (
    <>
      {/* Desktop — RTL order: logo (right) → nav → search → language → account (left) */}
      <header className="sticky top-0 z-50 hidden h-20 border-b border-outline-variant/40 bg-surface-container-lowest/95 backdrop-blur md:block">
        <div className="mx-auto flex h-full max-w-container-max items-center gap-6 px-margin-desktop">
          <Logo />

          <nav className="flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={
                  active === n.key
                    ? "whitespace-nowrap border-b-2 border-primary pb-1 text-body-md font-bold text-primary"
                    : "whitespace-nowrap text-body-md text-on-surface-variant transition-colors hover:text-primary"
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1">
            <div className="relative mx-auto max-w-md">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input type="text" placeholder="ابحث عن تخصص، دكتور، أو معمل..."
                className="w-full rounded-full border border-outline-variant/40 bg-surface-container-low py-2.5 pr-12 pl-4 text-body-md transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/20" />
            </div>
          </div>

          <LanguageSwitcher />
          <AccountMenu />
        </div>
      </header>

      {/* Mobile app bar — RTL: menu (right) · logo (center) · account (left) */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/40 bg-surface px-margin-mobile shadow-sm md:hidden">
        <button onClick={() => setMenuOpen(true)} aria-label="القائمة" className="text-primary">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <Logo />
        <AccountMenu />
      </header>

      {/* Mobile menu drawer */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside className={`fixed right-0 top-0 z-[71] flex h-full w-[80%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-outline-variant/40 p-4">
          <Logo />
          <button onClick={() => setMenuOpen(false)} className="text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-3 text-body-md ${active === n.key ? "bg-surface-container-low font-bold text-primary" : "text-on-surface hover:bg-surface-container-low"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-outline-variant/40 p-4">
          <LanguageSwitcher />
        </div>
      </aside>
    </>
  );
}
