import Link from "next/link";

// Shared footer — constant across every page (desktop + mobile).
export function PublicFooter() {
  const col = (title: string, links: [string, string][]) => (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-on-surface">{title}</h4>
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="text-caption text-on-surface-variant transition-colors hover:text-primary hover:underline">
          {label}
        </Link>
      ))}
    </div>
  );

  return (
    <footer className="border-t border-outline-variant bg-surface-container-low pb-24 md:pb-0">
      <div className="mx-auto flex w-full max-w-container-max flex-col justify-between gap-gutter px-margin-mobile py-section-gap md:flex-row-reverse md:px-margin-desktop">
        <div className="flex max-w-xs flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="text-headline-md font-bold text-primary">Avicena</span>
          </div>
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            منصتك الموثوقة للرعاية الصحية عن بُعد — أطباء ومعامل وصيدليات في مكان واحد.
          </p>
          <div className="flex gap-3">
            {["public", "alternate_email", "share"].map((i) => (
              <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-primary transition-all hover:bg-primary-container hover:text-white">
                <span className="material-symbols-outlined">{i}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {col("الخدمات", [
            ["الأطباء", "/doctors"],
            ["المعامل", "/labs"],
            ["الصيدليات", "/pharmacies"],
            ["استشارات عن بُعد", "/doctors"],
          ])}
          {col("حسابي", [
            ["تسجيل الدخول", "/login"],
            ["إنشاء حساب", "/register"],
            ["نقاط المكافآت", "/points"],
          ])}
          {col("المنصة", [
            ["عن ابن سينا", "/"],
            ["انضم كطبيب", "/login"],
            ["سجّل معملك", "/login"],
          ])}
          {col("قانوني", [
            ["الشروط والأحكام", "/"],
            ["سياسة الخصوصية", "/"],
            ["اتصل بنا", "/"],
          ])}
        </div>
      </div>
      <div className="border-t border-outline-variant/30">
        <div className="mx-auto max-w-container-max px-margin-mobile py-6 md:px-margin-desktop">
          <p className="text-center text-caption text-on-surface-variant md:text-right">
            © 2026 ابن سينا (Avicena). جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
