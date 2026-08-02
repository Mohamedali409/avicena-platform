"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listInventory,
  addInventoryItem,
  removeInventoryItem,
  previewImport,
  applyImport,
  type AddItemInput,
  type ImportPreview,
} from "@/features/pharmacy/api";

const EMPTY: AddItemInput = { name: "", barcode: "", price: 0, stock: 0 };

export default function PharmacyInventoryPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["pharmacy-inventory"],
    queryFn: () => listInventory(1, 200),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddItemInput>(EMPTY);
  const [showImport, setShowImport] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pharmacy-inventory"] });
    qc.invalidateQueries({ queryKey: ["pharmacy-inventory-count"] });
  };

  const addMut = useMutation({
    mutationFn: (input: AddItemInput) => addInventoryItem(input),
    onSuccess: () => {
      setShowAdd(false);
      setForm(EMPTY);
      invalidate();
    },
  });

  const delMut = useMutation({
    mutationFn: (productId: string) => removeInventoryItem(productId),
    onSuccess: invalidate,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">المخزون</h1>
          <p className="text-on-surface-variant">{data?.total ?? 0} صنف</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md text-primary transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            رفع Excel
          </button>
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg bg-primary-container px-4 py-2 text-label-md text-white transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            إضافة صنف
          </button>
        </div>
      </div>

      {showAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addMut.mutate({ ...form, price: Number(form.price), stock: Number(form.stock) });
          }}
          className="grid gap-3 rounded-xl border border-outline-variant/40 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-5"
        >
          <input required placeholder="الاسم" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary" />
          <input placeholder="الباركود (اختياري)" value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            className="rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary" />
          <input required type="number" min={0} step="0.01" placeholder="السعر" value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary" />
          <input type="number" min={0} placeholder="المخزون" value={form.stock || ""}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary" />
          <button type="submit" disabled={addMut.isPending}
            className="rounded-lg bg-primary-container px-4 py-2 text-white disabled:opacity-50">
            {addMut.isPending ? "..." : "حفظ"}
          </button>
          {addMut.isError && (
            <p className="col-span-full text-caption text-error">تعذّر الإضافة — تأكد من البيانات</p>
          )}
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
        {isLoading ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">جارٍ التحميل…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">لا توجد أصناف بعد — أضف صنفًا أو ارفع Excel</p>
        ) : (
          <table className="w-full text-right">
            <thead className="border-b border-outline-variant/40 text-caption text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-medium">الصنف</th>
                <th className="px-4 py-3 font-medium">المادة الفعّالة</th>
                <th className="px-4 py-3 font-medium">السعر</th>
                <th className="px-4 py-3 font-medium">المخزون</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {items.map((it) => (
                <tr key={it._id} className="text-body-md text-on-surface">
                  <td className="px-4 py-3">{it.productId?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{it.productId?.activeIngredient || "—"}</td>
                  <td className="px-4 py-3">{it.price} ج.م</td>
                  <td className="px-4 py-3">
                    <span className={it.stock > 0 ? "" : "text-error"}>{it.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button
                      onClick={() => it.productId?._id && delMut.mutate(it.productId._id)}
                      className="text-error hover:opacity-70"
                      aria-label="حذف"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} onDone={invalidate} />}
    </div>
  );
}

// ── Excel import modal (preview → apply) ──────────────────────
function ImportModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"upsert" | "replace">("upsert");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const doPreview = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setPreview(await previewImport(file, mode));
    } catch {
      setError("تعذّر قراءة الملف — تأكد إنه Excel/CSV صحيح");
    } finally {
      setBusy(false);
    }
  };

  const doApply = async () => {
    if (!file || !preview) return;
    setBusy(true);
    setError("");
    try {
      await applyImport(file, preview.batchId, mode);
      onDone();
      onClose();
    } catch {
      setError("تعذّر تطبيق الاستيراد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-card-hover" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-1 text-headline-sm text-on-surface">رفع شيت المنتجات (Excel/CSV)</h2>
        <p className="mb-4 text-caption text-on-surface-variant">
          الأعمدة المدعومة: الاسم/الباركود/المادة الفعالة/التصنيف/السعر/الكمية (عربي أو إنجليزي).
        </p>

        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); }}
            className="block w-full text-body-md file:mr-3 file:rounded-lg file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-white"
          />

          <div className="flex items-center gap-4 text-body-md">
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === "upsert"} onChange={() => setMode("upsert")} />
              دمج (إضافة/تحديث)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === "replace"} onChange={() => setMode("replace")} />
              استبدال الكل
            </label>
          </div>

          {!preview ? (
            <button onClick={doPreview} disabled={!file || busy}
              className="w-full rounded-lg bg-primary-container py-2.5 text-white disabled:opacity-50">
              {busy ? "جارٍ المعاينة…" : "معاينة"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg bg-surface-container-low p-3 text-body-md">
                <p>✅ صفوف صالحة: <strong>{preview.total}</strong></p>
                {preview.errors?.length > 0 && (
                  <p className="text-error">⚠️ صفوف بها أخطاء: {preview.errors.length}</p>
                )}
              </div>
              {preview.sample?.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-outline-variant/40 text-caption">
                  {preview.sample.slice(0, 10).map((r, i) => (
                    <div key={i} className="border-b border-outline-variant/30 px-3 py-1.5 last:border-0">
                      {String(r.name ?? r.barcode ?? "—")} · {String(r.price ?? 0)} · {String(r.stock ?? 0)}
                    </div>
                  ))}
                </div>
              )}
              <button onClick={doApply} disabled={busy}
                className="w-full rounded-lg bg-primary-container py-2.5 text-white disabled:opacity-50">
                {busy ? "جارٍ التطبيق…" : `تطبيق (${preview.total} صنف)`}
              </button>
            </div>
          )}

          {error && <p className="text-caption text-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
