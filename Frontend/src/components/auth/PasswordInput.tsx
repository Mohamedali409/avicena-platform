"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

// Reusable password field with a lock icon + show/hide toggle.
export function PasswordInput({
  field,
  error,
  placeholder = "••••••••",
}: {
  field: UseFormRegisterReturn;
  error?: boolean;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
      <input
        {...field}
        type={show ? "text" : "password"}
        dir="ltr"
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-surface-container-low/40 py-3.5 pr-12 pl-12 text-[15px] outline-none transition-all placeholder:text-outline focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/10 ${error ? "border-error" : "border-outline-variant/70"}`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
      >
        <span className="material-symbols-outlined">{show ? "visibility_off" : "visibility"}</span>
      </button>
    </div>
  );
}
