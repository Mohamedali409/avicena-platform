/* eslint-disable @next/next/no-img-element */

// Background image (Stitch placeholder — swap for a branded asset later).
const BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-pOb0lBdcsn_Bau-fj5g751-t8Qo12tPll_H5Fht7esqMg2xNYF82iv_n-G6MjriKZ39UKy_y2SFz4585Sn5-vQiW_b1RRYd8B8tdBuC2WjjdcM_j2MRL2FU3q5lFLdX5JeXUopTEWQ85AMHV7scBWploEHa4OofyZ3QnEPprP4x7MxiJPC3vaE66K2PTyKfTqIZo3cbPUF-QiYciLI7FCDQvE_drEjIMf2HHeykv1DA5zZSyUtnRO7Y8AlmdCGKm8sEVuyH8DNc";

const FEATURES = [
  { icon: "stethoscope", title: "الأطباء", desc: "احجز مع نخبة الأطباء" },
  { icon: "biotech", title: "المعامل", desc: "احجز تحاليلك بسهولة" },
  { icon: "local_pharmacy", title: "الصيدليات", desc: "أدويتك لباب بيتك" },
  { icon: "folder_shared", title: "السجل الطبي", desc: "ملفك آمن ومنظّم" },
];

// Marketing panel shown beside auth forms on large screens.
export function AuthSidePanel() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:block">
      {/* photo + gradient overlay (lighter so the image shows through) */}
      <img src={BG} alt="رعاية صحية" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#082e3a]/95 via-primary/80 to-primary-container/60" />
      <div className="absolute -right-16 top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-16 left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-center px-12 text-white">
        <div className="mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          <span className="text-2xl font-bold tracking-tight">Avicena</span>
        </div>

        <h2 className="mb-4 text-4xl font-bold leading-tight">رحلتك الصحية<br />تبدأ من هنا</h2>
        <p className="mb-10 max-w-md text-lg text-white/90">
          أطباء، معامل، وصيدليات وسجلّك الطبي — كل رعايتك الصحية في مكان واحد آمن.
        </p>

        {/* feature cards */}
        <div className="grid max-w-lg grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur transition-colors hover:bg-white/15">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
              </div>
              <p className="font-bold">{f.title}</p>
              <p className="text-sm text-white/80">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-white/80">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          بياناتك محميّة ومشفّرة بمعايير أمان عالية
        </div>
      </div>
    </div>
  );
}
