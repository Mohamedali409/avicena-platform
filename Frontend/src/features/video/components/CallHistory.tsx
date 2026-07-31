"use client";

import { useQuery } from "@tanstack/react-query";
import { getCallHistory } from "@/features/video/api";
import type { CallRecord } from "@/features/video/types";

const fmtDuration = (s: number) => {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const statusMeta = (c: CallRecord) => {
  if (c.status === "missed") return { icon: "call_missed", cls: "text-error", label: "فائتة" };
  if (c.status === "rejected") return { icon: "call_end", cls: "text-error", label: "مرفوضة" };
  return { icon: c.type === "video" ? "videocam" : "call", cls: "text-primary", label: "" };
};

const dateLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })
    : "";

// Compact call log. Renders nothing when there are no calls, so it can sit at
// the bottom of the conversations list without adding noise.
export function CallHistory() {
  const { data: calls = [] } = useQuery({
    queryKey: ["call-history"],
    queryFn: () => getCallHistory(1, 10),
  });

  if (calls.length === 0) return null;

  return (
    <section className="space-y-2 pt-2">
      <h2 className="flex items-center gap-2 text-label-md text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">call_log</span>
        سجل المكالمات
      </h2>
      <ul className="divide-y divide-outline-variant rounded-xl bg-white shadow-card">
        {calls.map((c) => {
          const m = statusMeta(c);
          return (
            <li key={c._id} className="flex items-center gap-3 p-3">
              <span className={`material-symbols-outlined text-[20px] ${m.cls}`}>
                {m.icon}
              </span>
              <div className="flex-1">
                <p className="text-caption text-on-surface">
                  {c.type === "video" ? "مكالمة فيديو" : "مكالمة صوت"}
                  {m.label && ` — ${m.label}`}
                </p>
                <p className="text-[10px] text-on-surface-variant">{dateLabel(c.createdAt)}</p>
              </div>
              <span className="text-caption text-on-surface-variant">
                {fmtDuration(c.durationInSeconds)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
