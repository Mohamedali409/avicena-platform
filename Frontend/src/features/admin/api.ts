import { api } from "@/lib/api/client";

// Admin console client. Mirrors /api/admin/* (adminGuard, cookie-based).
// Responses are `{ success, message, ...data }`.

export interface AdminDashboard {
  doctors: number;
  users: number;
  appointments: number;
  consultations: number;
  reports: number;
  labs: number;
  lastAppointment: Array<Record<string, unknown>>;
  lastConsultation: Array<Record<string, unknown>>;
}

// GET /api/admin/dashboard → { doshData }  (note: backend key is "doshData")
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const { data } = await api.get("/api/admin/dashboard");
  return (data.doshData ?? data.data) as AdminDashboard;
};

// ── Doctors ────────────────────────────────────────────
export interface AdminDoctor {
  _id: string;
  doctorName: string;
  email?: string;
  specialization?: string;
  fees?: number;
  available?: boolean;
  image?: string;
}

export const getAdminDoctors = async (): Promise<AdminDoctor[]> => {
  const { data } = await api.get("/api/admin/doctors");
  return (data.doctors ?? []) as AdminDoctor[];
};

// POST /api/admin/doctors — multipart (image + JSON address/start_booked)
export const addAdminDoctor = async (fd: FormData) => {
  await api.post("/api/admin/doctors", fd);
};

export const removeAdminDoctor = async (docId: string) => {
  await api.delete("/api/admin/doctors", { data: { docId } });
};

export const toggleDoctorAvailability = async (docId: string) => {
  await api.patch("/api/admin/doctors/availability", { docId });
};

// ── Users ──────────────────────────────────────────────
export interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/api/admin/users");
  return (data.users ?? []) as AdminUser[];
};

export const toggleUserStatus = async (userId: string) => {
  await api.patch("/api/admin/users/status", { userId });
};

// ── Appointments ───────────────────────────────────────
export interface AdminAppointment {
  _id: string;
  userId: string;
  docId: string;
  userData?: { name?: string };
  docData?: { doctorName?: string };
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
}

export const getAdminAppointments = async (): Promise<AdminAppointment[]> => {
  const { data } = await api.get("/api/admin/appointment");
  return (data.appointments ?? []) as AdminAppointment[];
};

export const cancelAdminAppointment = async (appointmentId: string) => {
  await api.patch("/api/admin/appointment/cancel", { appointmentId });
};

export const completeAdminAppointment = async (a: AdminAppointment) => {
  await api.patch("/api/admin/appointment/complete", {
    appointmentId: a._id,
    userId: a.userId,
    docId: a.docId,
  });
};

// ── Reports ────────────────────────────────────────────
export interface AdminReport {
  _id: string;
  userData?: { name?: string };
  docData?: { doctorName?: string };
  diagnosis: string;
  createdAt: string;
}

export const getAdminReports = async (): Promise<AdminReport[]> => {
  const { data } = await api.get("/api/admin/reports");
  return (data.reports ?? []) as AdminReport[];
};

export const deleteAdminReport = async (reportId: string) => {
  await api.delete("/api/admin/report", { data: { reportId } });
};

// ── Labs (public list) ─────────────────────────────────
export interface AdminLab {
  _id: string;
  name: string;
  email?: string;
  address?: { city?: string };
  isVerified?: boolean;
  isActive?: boolean;
}

export const getAdminLabs = async (): Promise<AdminLab[]> => {
  const { data } = await api.get("/api/lab");
  return (data.labs ?? []) as AdminLab[];
};
