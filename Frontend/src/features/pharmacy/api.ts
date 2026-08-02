import { api } from "@/lib/api/client";

// Pharmacy domain — base `/api/v1/pharmacy`. Auth is the httpOnly cookie
// (role must be "pharmacy"). Responses are flat: read `data.<key>` directly.

export interface PharmacyProfile {
  _id: string;
  pharmacyName: string;
  ownerName?: string;
  email: string;
  phone?: string;
  image?: string;
  address?: { line1?: string; line2?: string; city?: string };
  licenseNumber?: string;
  description?: string;
  isActive?: boolean;
  workingHours?: { from?: string; to?: string };
  delivery?: { available?: boolean; fee?: number; minOrder?: number; etaMinutes?: number };
  pickup?: { available?: boolean };
  rating?: { average?: number; count?: number };
}

export interface InventoryItem {
  _id: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  productId?: {
    _id: string;
    name: string;
    barcode?: string;
    activeIngredient?: string;
    category?: string;
    strength?: string;
    manufacturer?: string;
    image?: string;
  };
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: { _id: string; name?: string; email?: string } | string;
  items: { productId?: string; name: string; price: number; qty: number; lineTotal: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  fulfillment: { method: "delivery" | "pickup"; address?: { line1?: string; city?: string; phone?: string } };
  payment: { method: "cod" | "online"; status: "pending" | "paid" | "failed" | "refunded" };
  status: OrderStatus;
  statusHistory?: { status: string; at: string; note?: string }[];
  createdAt: string;
}

// ── Profile ────────────────────────────────────────────
export const getPharmacyProfile = async (): Promise<PharmacyProfile> => {
  const { data } = await api.get("/api/v1/pharmacy/me/profile");
  return data.pharmacy as PharmacyProfile;
};

export const updatePharmacyProfile = async (
  form: FormData,
): Promise<PharmacyProfile> => {
  const { data } = await api.put("/api/v1/pharmacy/me/profile", form);
  return data.pharmacy as PharmacyProfile;
};

// ── Inventory ──────────────────────────────────────────
export const listInventory = async (
  page = 1,
  limit = 50,
): Promise<{ items: InventoryItem[]; total: number }> => {
  const { data } = await api.get("/api/v1/pharmacy/inventory/me", {
    params: { page, limit },
  });
  return { items: (data.items ?? []) as InventoryItem[], total: data.total ?? 0 };
};

export interface AddItemInput {
  productId?: string;
  barcode?: string;
  name?: string;
  price: number;
  stock?: number;
  isAvailable?: boolean;
  activeIngredient?: string;
  category?: string;
  strength?: string;
  manufacturer?: string;
}

export const addInventoryItem = async (input: AddItemInput) => {
  const { data } = await api.post("/api/v1/pharmacy/inventory/me/items", input);
  return data.item as InventoryItem;
};

export const removeInventoryItem = async (productId: string) => {
  await api.delete(`/api/v1/pharmacy/inventory/me/items/${productId}`);
};

// Excel import (field name "file"). Two-step: preview → apply.
export interface ImportPreview {
  batchId: string;
  mode: "upsert" | "replace";
  total: number;
  sample: Record<string, unknown>[];
  errors: { row: number; reason: string }[];
}

export const previewImport = async (
  file: File,
  mode: "upsert" | "replace" = "upsert",
): Promise<ImportPreview> => {
  const form = new FormData();
  form.append("file", file);
  form.append("mode", mode);
  const { data } = await api.post(
    "/api/v1/pharmacy/inventory/me/import/preview",
    form,
  );
  return data as ImportPreview;
};

export const applyImport = async (
  file: File,
  batchId: string,
  mode: "upsert" | "replace" = "upsert",
) => {
  const form = new FormData();
  form.append("file", file);
  form.append("batchId", batchId);
  form.append("mode", mode);
  const { data } = await api.post(
    "/api/v1/pharmacy/inventory/me/import/apply",
    form,
  );
  return data.batch;
};

// ── Orders (pharmacy side) ─────────────────────────────
export const getPharmacyOrders = async (
  status?: OrderStatus,
): Promise<Order[]> => {
  const { data } = await api.get("/api/v1/pharmacy/order/pharmacy", {
    params: status ? { status } : undefined,
  });
  return (data.orders ?? []) as Order[];
};

export const getPharmacyOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/api/v1/pharmacy/order/pharmacy/${id}`);
  return data.order as Order;
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  note?: string,
) => {
  const { data } = await api.patch(
    `/api/v1/pharmacy/order/pharmacy/${id}/status`,
    { status, note },
  );
  return data.order as Order;
};
