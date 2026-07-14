import { api } from "@/lib/api/client";

// Patient self-service client. Mirrors /api/user/*.
// The interceptor attaches `Authorization: Bearer <token>` for patients.

export interface Paginated<T> { items: T[]; page: number; limit: number; total: number; totalPages: number; }

export const getProfile = async () => (await api.get("/api/user/profile")).data.data;

export const listAppointments = async (page = 1, limit = 10) =>
  (await api.get<{ data: Paginated<unknown> }>("/api/user/appointments", { params: { page, limit } })).data.data;

export const bookAppointment = async (docId: string, slotDate: string, slotTime: string) =>
  (await api.post("/api/user/appointments", { docId, slotDate, slotTime })).data.data;

export const cancelAppointment = async (appointmentId: string) =>
  (await api.patch("/api/user/appointments/cancel", { appointmentId })).data.data;

export const getReports = async () => (await api.get("/api/user/reports")).data.data;
