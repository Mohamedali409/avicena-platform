"use client";

import { useState } from "react";
import Link from "next/link";

// Note: backend endpoints for forgot/reset are stubbed (auth.tokens.js).
// This screen is UI-ready; wire it once /api/auth/forgot & /reset exist.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true); // TODO: call POST /api/auth/forgot-password
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-gray-800">استعادة كلمة المرور</h1>
        <p className="mb-6 text-sm text-gray-500">أدخل بريدك وسنرسل لك رابط إعادة التعيين</p>

        {sent ? (
          <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-800">
            ✅ إذا كان البريد مسجّلاً لدينا، فستصلك رسالة خلال دقائق.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="w-full rounded-lg border border-gray-200 p-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              type="email" placeholder="name@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            <button className="w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:bg-teal-800">
              إرسال رابط الاستعادة
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:text-brand">العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
