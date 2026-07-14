"use client";

import { useEffect, useState } from "react";

// Language toggle (AR / EN). Persists the choice; full i18n translation
// wiring is a later step — for now this switches the label + stored preference.
export function LanguageSwitcher() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    const saved = localStorage.getItem("avicena.lang");
    if (saved === "en" || saved === "ar") setLang(saved);
  }, []);

  const toggle = () => {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("avicena.lang", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="تغيير اللغة"
      className="flex items-center gap-1.5 rounded-full border border-outline-variant/60 px-3 py-1.5 text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
    >
      <span className="material-symbols-outlined text-[18px]">language</span>
      <span>{lang === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}
