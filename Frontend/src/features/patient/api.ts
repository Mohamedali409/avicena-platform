import { api } from "@/lib/api/client";

// Patient self-service client. Mirrors /api/user/*.
// The interceptor attaches `Authorization: Bearer <token>` for patients.

export interface Paginated<T> { items: T[]; page: number; limit: number; total: number; totalPages: number; }

export interface UserProfile {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  nationalId?: string;
  address?: { line1?: string; line2?: string };
}

// GET /api/user/profile → { userData }
export const getProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get("/api/user/profile");
  return (data.userData ?? data.data) as UserProfile;
};

export interface ProfileInput {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  nationalId?: string;
  address?: { line1?: string; line2?: string };
}

// PUT /api/user/profile — backend expects multipart/form-data.
export const updateProfile = async (input: ProfileInput) => {
  const fd = new FormData();
  if (input.name) fd.append("name", input.name);
  if (input.phone) fd.append("phone", input.phone);
  if (input.gender) fd.append("gender", input.gender);
  if (input.dob) fd.append("dob", input.dob);
  if (input.nationality) fd.append("nationality", input.nationality);
  if (input.nationalId) fd.append("nationalId", input.nationalId);
  if (input.address) fd.append("address", JSON.stringify(input.address));
  const { data } = await api.put("/api/user/profile", fd);
  return data;
};

export const listAppointments = async (page = 1, limit = 10) =>
  (await api.get<{ data: Paginated<unknown> }>("/api/user/appointments", { params: { page, limit } })).data.data;

export const bookAppointment = async (docId: string, slotDate: string, slotTime: string) =>
  (await api.post("/api/user/appointments", { docId, slotDate, slotTime })).data.data;

export const cancelAppointment = async (appointmentId: string) =>
  (await api.patch("/api/user/appointments/cancel", { appointmentId })).data.data;

export interface ReportTreatment {
  name: string;
  dosage?: string;
  duration?: string;
}

export interface MedicalReport {
  _id: string;
  docData?: { doctorName?: string; specialization?: string };
  complaint: string;
  examination: string;
  diagnosis: string;
  treatment?: ReportTreatment[];
  notes?: string;
  nextVisit?: string;
  createdAt: string;
}

// GET /api/user/reports → { reports: MedicalReport[] }
export const getReports = async (): Promise<MedicalReport[]> => {
  const { data } = await api.get("/api/user/reports");
  return (data.reports ?? data.data ?? []) as MedicalReport[];
};

export interface Consultation {
  _id: string;
  docId: string;
  docData?: { doctorName?: string; specialization?: string };
  userData?: { name?: string };
  consultDay: string;
  consultTime: string;
  amount: number;
  isCompleted: boolean;
  cancelled: boolean;
  notes?: string;
}

// GET /api/user/consultations → { consultation: Consultation[] }
export const getConsultations = async (): Promise<Consultation[]> => {
  const { data } = await api.get("/api/user/consultations");
  return (data.consultation ?? data.data ?? []) as Consultation[];
};

// PATCH /api/user/consultations/time  { consultationId, consultTime }
export const rescheduleConsultation = async (
  consultationId: string,
  consultTime: string,
) => {
  await api.patch("/api/user/consultations/time", {
    consultationId,
    consultTime,
  });
};

// POST /api/user/consultations/cancel  { consultationId, docId }
export const cancelConsultation = async (
  consultationId: string,
  docId: string,
) => {
  await api.post("/api/user/consultations/cancel", { consultationId, docId });
};

export interface PatientStats {
  appointments: number;
  reports: number;
  consultations: number;
}

// GET /api/user/stats → { stats: { appointments, reports, consultations } }
export const getStats = async (): Promise<PatientStats> => {
  const { data } = await api.get("/api/user/stats");
  return (data.stats ?? { appointments: 0, reports: 0, consultations: 0 }) as PatientStats;
};
