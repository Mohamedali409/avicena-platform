import { api } from "@/lib/api/client";

// Booking / appointments client. Backend responses are `{ success, message, ...data }`
// (payload spread at the top level), so we read the named key off `data`.

export interface DaySlots {
  date: string;
  available: string[]; // ["09:00","09:15", ...]
  booked: string[];
  working: { from: number; to: number; booking_period: number };
  doctorAvailable: boolean;
}

export interface Appointment {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
  docData?: Record<string, unknown>;
  userData?: Record<string, unknown>;
  createdAt: string;
}

// GET /api/doctor/:id/slots?date=YYYY-MM-DD  (public — no auth needed)
export const getAvailableSlots = async (
  docId: string,
  date: string,
): Promise<DaySlots> => {
  const { data } = await api.get(`/api/doctor/${docId}/slots`, {
    params: { date },
  });
  return data.slots as DaySlots;
};

export type VisitType = "examination" | "consultation";

// POST /api/user/appointments  { docId, slotDate, slotTime, type }  (patient)
export const bookAppointment = async (
  docId: string,
  slotDate: string,
  slotTime: string,
  type: VisitType = "examination",
): Promise<Appointment> => {
  const { data } = await api.post("/api/user/appointments", {
    docId,
    slotDate,
    slotTime,
    type,
  });
  return (data.appointment ?? data.data) as Appointment;
};

// GET /api/user/appointments?page&limit  (patient)
// Backend shape: { appointment: { data: Appointment[], pagination } }
export const listAppointments = async (
  page = 1,
  limit = 10,
): Promise<Appointment[]> => {
  const { data } = await api.get("/api/user/appointments", {
    params: { page, limit },
  });
  const payload = data.appointment ?? data.data ?? {};
  return (payload.data ?? payload.items ?? payload ?? []) as Appointment[];
};

// PATCH /api/user/appointments/cancel  { appointmentId }  (patient)
export const cancelAppointment = async (appointmentId: string) => {
  const { data } = await api.patch("/api/user/appointments/cancel", {
    appointmentId,
  });
  return data;
};
