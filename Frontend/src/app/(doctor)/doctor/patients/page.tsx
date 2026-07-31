"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  getDoctorAppointments,
  searchPatients,
  type PatientHit,
} from "@/features/doctor/api";
import { useAuth } from "@/store/auth.store";

// Build a room id the same way the backend does: sorted "a_b".
const roomWith = (selfId: string | null, otherId: string) =>
  selfId ? [selfId, otherId].sort().join("_") : "";

export default function DoctorPatientsPage() {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const selfId = useAuth((s) => s.session?.user._id ?? null);

  // default list: unique patients derived from the doctor's appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: getDoctorAppointments,
  });

  const derived = useMemo(() => {
    const seen = new Map<string, PatientHit>();
    for (const a of appointments) {
      const name = a.userData?.name ?? "";
      if (name && !seen.has(name)) {
        seen.set(name, {
          _id: a._id,
          userId: (a as { userId?: string }).userId ?? "",
          userData: a.userData,
          slotDate: a.slotDate,
          slotTime: a.slotTime,
        });
      }
    }
    return [...seen.values()];
  }, [appointments]);

  const { data: results, isFetching } = useQuery({
    queryKey: ["patient-search", term],
    queryFn: () => searchPatients(term),
    enabled: term.length > 0,
  });

  const list = term ? (results ?? []) : derived;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">المرضى</h1>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTerm(q.trim());
        }}
        className="flex items-center gap-2"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو الهاتف أو الرقم القومي…"
            className="flex-1 bg-transparent text-body-md text-on-surface outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary-container px-5 py-2.5 text-label-md text-white"
        >
          بحث
        </button>
        {term && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setTerm("");
            }}
            className="rounded-xl border border-outline-variant px-4 py-2.5 text-label-md text-on-surface-variant"
          >
            الكل
          </button>
        )}
      </form>

      {isFetching && (
        <p className="text-caption text-on-surface-variant">جارٍ البحث…</p>
      )}

      {list.length === 0 && !isFetching && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            group_off
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {term ? "لا توجد نتائج للبحث." : "لا يوجد مرضى بعد."}
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {list.map((p) => (
          <li
            key={p._id}
            className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">
                  {p.userData?.name ?? "مريض"}
                </p>
                <p className="text-caption text-on-surface-variant">
                  {p.userData?.phone ?? p.slotDate ?? ""}
                </p>
              </div>
            </div>
            {p.userId && (
              <Link
                href={`/doctor/chat/${roomWith(selfId, p.userId)}`}
                className="flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-primary transition-colors hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                محادثة
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
