"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPatientSummary, askAboutPatient, type ChatTurn } from "./api";

// Doctor-only RAG assistant about a specific patient. Shows a records summary
// and answers free-text questions grounded in the patient's reports.
export function MedicalAIPanel({ patientId }: { patientId: string }) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [q, setQ] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["ai-summary", patientId],
    queryFn: () => getPatientSummary(patientId),
    enabled: !!patientId,
  });

  const ask = useMutation({
    mutationFn: (question: string) => askAboutPatient(patientId, question, turns),
    onSuccess: (answer, question) => {
      setTurns((t) => [
        ...t,
        { role: "user", content: question },
        { role: "assistant", content: answer },
      ]);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }),
      );
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (question.length < 3 || ask.isPending) return;
    ask.mutate(question);
    setQ("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl bg-white shadow-card">
      <header className="flex items-center gap-2 border-b border-outline-variant px-5 py-4">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          neurology
        </span>
        <div>
          <p className="text-label-md text-on-surface">المساعد الطبي الذكي</p>
          <p className="text-caption text-on-surface-variant">
            {loadingSummary
              ? "جارٍ تحليل السجل…"
              : summary
                ? `${summary.reportsCount} تقرير في السجل`
                : "مبني على تقارير المريض"}
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface-container-low p-4">
        {/* Summary card */}
        {summary && (
          <div className="rounded-xl border border-primary/20 bg-white p-4">
            <p className="mb-1 flex items-center gap-1 text-caption font-medium text-primary">
              <span className="material-symbols-outlined text-[16px]">summarize</span>
              ملخّص السجل الطبي
            </p>
            <p className="whitespace-pre-wrap text-body-md leading-relaxed text-on-surface-variant">
              {summary.summary}
            </p>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-2 text-body-md ${
                t.role === "user"
                  ? "bg-primary-container text-white"
                  : "border border-outline-variant bg-white text-on-surface"
              }`}
            >
              {t.content}
            </div>
          </div>
        ))}

        {ask.isPending && (
          <div className="flex justify-end">
            <div className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-caption text-on-surface-variant">
              يفكّر…
            </div>
          </div>
        )}
        {ask.isError && (
          <p className="text-center text-caption text-error">تعذّر الحصول على إجابة، حاول مجددًا.</p>
        )}
        {turns.length === 0 && !ask.isPending && (
          <p className="py-6 text-center text-caption text-on-surface-variant">
            اسأل عن تاريخ المريض، تشخيصاته، أو أدويته السابقة.
          </p>
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-outline-variant px-4 py-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="اسأل عن حالة المريض…"
          className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={q.trim().length < 3 || ask.isPending}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-white transition-all hover:opacity-90 disabled:opacity-40"
          aria-label="اسأل"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
