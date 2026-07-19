// Shared labeled stepper for multi-step auth flows (register, reset password).
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                i < current
                  ? "bg-primary-container text-white"
                  : i === current
                    ? "bg-primary-container text-white ring-4 ring-primary-container/20"
                    : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {i < current ? <span className="material-symbols-outlined text-[18px]">check</span> : i + 1}
            </div>
            <span className={`mt-1 whitespace-nowrap text-xs ${i === current ? "font-medium text-primary" : "text-on-surface-variant"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`mx-2 h-0.5 w-10 sm:w-12 ${i < current ? "bg-primary-container" : "bg-outline-variant"}`} />}
        </div>
      ))}
    </div>
  );
}
