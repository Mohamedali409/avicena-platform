"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAuth } from "@/store/auth.store";
import { getDoctors } from "@/features/doctors/api";
import { getLabs } from "@/features/labs/api";

interface Result {
  id: string;
  label: string;
  sub?: string;
  icon: string;
  href: string;
}

// Role-aware search:
//  • doctor  → searches THEIR patients → opens the chat with that patient
//  • patient → searches doctors / labs / pharmacies → opens that entity's page
// Renders nothing for roles without a search (lab / admin).
export function HeaderSearch() {
  const role = useAuth((s) => s.session?.role);
  const selfId = useAuth((s) => s.session?.user._id ?? null);
  const router = useRouter();

  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const placeholder = useMemo(() => {
    if (role === "doctor") return "ابحث عن مريض…";
    if (role === "patient") return "ابحث عن طبيب، صيدلية أو معمل…";
    return "بحث…";
  }, [role]);

  // Debounced search.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        setResults(await runSearch(role, term, selfId));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, role, selfId]);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // No search for lab/admin.
  if (role !== "doctor" && role !== "patient") return null;

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    setResults([]);
    router.push(href);
  };

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2.5 pr-10 pl-4 text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        />
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-outline-variant/40 bg-white py-1 shadow-card">
          {loading ? (
            <p className="p-3 text-center text-caption text-on-surface-variant">
              جارٍ البحث…
            </p>
          ) : results.length === 0 ? (
            <p className="p-3 text-center text-caption text-on-surface-variant">
              لا توجد نتائج
            </p>
          ) : (
            results.map((r) => (
              <button
                key={`${r.icon}-${r.id}`}
                onClick={() => go(r.href)}
                className="flex w-full items-center gap-3 px-3 py-2 text-right transition-colors hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-label-md text-on-surface">
                    {r.label}
                  </span>
                  {r.sub && (
                    <span className="block truncate text-caption text-on-surface-variant">
                      {r.sub}
                    </span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

async function runSearch(
  role: string | undefined,
  term: string,
  selfId: string | null,
): Promise<Result[]> {
  const t = term.toLowerCase();

  if (role === "doctor") {
    const { data } = await api.post("/api/doctor/search", { q: term });
    const users = (data.user ?? data.users ?? data.data ?? []) as Array<{
      _id: string;
      name?: string;
      email?: string;
    }>;
    return users.slice(0, 8).map((u) => ({
      id: u._id,
      label: u.name ?? "مريض",
      sub: u.email,
      icon: "person",
      href: `/doctor/chat/${[selfId, u._id].sort().join("_")}`,
    }));
  }

  if (role === "patient") {
    const [docs, labs, phs] = await Promise.all([
      getDoctors().catch(() => []),
      getLabs().catch(() => []),
      api
        .get("/api/v1/pharmacy")
        .then(
          (r) =>
            (r.data.pharmacies ?? r.data.data ?? []) as Array<{
              _id: string;
              pharmacyName?: string;
              name?: string;
              address?: { city?: string };
            }>,
        )
        .catch(() => []),
    ]);

    const doctorResults: Result[] = docs
      .filter(
        (d) =>
          d.doctorName?.toLowerCase().includes(t) ||
          d.specialization?.toLowerCase().includes(t),
      )
      .slice(0, 5)
      .map((d) => ({
        id: d._id,
        label: d.doctorName,
        sub: d.specialization,
        icon: "stethoscope",
        href: `/doctors/${d._id}`,
      }));

    const labResults: Result[] = labs
      .filter((l) => l.name?.toLowerCase().includes(t))
      .slice(0, 3)
      .map((l) => ({
        id: l._id,
        label: l.name,
        sub: "معمل",
        icon: "biotech",
        href: `/labs/${l._id}`,
      }));

    const pharmacyResults: Result[] = phs
      .filter((p) => (p.pharmacyName ?? p.name ?? "").toLowerCase().includes(t))
      .slice(0, 3)
      .map((p) => ({
        id: p._id,
        label: p.pharmacyName ?? p.name ?? "صيدلية",
        sub: "صيدلية",
        icon: "local_pharmacy",
        href: "/pharmacies",
      }));

    return [...doctorResults, ...labResults, ...pharmacyResults];
  }

  return [];
}
