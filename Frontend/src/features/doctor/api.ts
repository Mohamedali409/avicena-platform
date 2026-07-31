import { api } from "@/lib/api/client";

// Doctor workspace client. Mirrors /api/doctor/*. Auth is cookie-based
// (dtoken/accessToken) via withCredentials. Responses are `{ success, message, ...data }`.

export interface DoctorDashboard {
  earnings_appointments: number;
  earnings_consultations: number;
  appointments: number;
  patients: number;
  consultations_patients: number;
  lastAppointments: Array<Record<string, unknown>>;
  lastConsultations: Array<Record<string, unknown>>;
}

// GET /api/doctor/dashboard → { dashData }
export const getDashboard = async (): Promise<DoctorDashboard> => {
  const { data } = await api.get("/api/doctor/dashboard");
  return data.dashData as DoctorDashboard;
};

export interface DoctorProfile {
  _id: string;
  doctorName: string;
  email: string;
  specialization?: string;
  degree?: string;
  expertise?: string;
  about?: string;
  image?: string;
  phone?: string;
  available?: boolean;
  fees?: number;
  consultation_fees?: number;
  address?: { line1?: string; line2?: string; city?: string };
  start_booked?: { from?: number; to?: number; booking_period?: number };
}

// GET /api/doctor/profile → { doctorInfo }
export const getDoctorProfile = async (): Promise<DoctorProfile> => {
  const { data } = await api.get("/api/doctor/profile");
  return (data.doctorInfo ?? data.data) as DoctorProfile;
};

export interface DoctorProfileInput {
  fees?: number;
  consultation_fees?: number;
  available?: boolean;
  phone?: string;
  address?: { line1?: string; line2?: string; city?: string };
  start_booked?: { from?: number; to?: number; booking_period?: number };
}

// PUT /api/doctor/profile — JSON body. The backend accepts address/start_booked
// as objects (it JSON.parses only if they arrive as strings).
export const updateDoctorProfile = async (input: DoctorProfileInput) => {
  await api.put("/api/doctor/profile", input);
};

export interface DoctorAppointment {
  _id: string;
  userId?: string;
  userData?: { name?: string; phone?: string };
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
}

export interface DoctorConsultation {
  _id: string;
  userId: string;
  userData?: { name?: string };
  consultDay: string;
  consultTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
  notes?: string;
}

// GET /api/doctor/appointments → { appointments }
export const getDoctorAppointments = async (): Promise<DoctorAppointment[]> => {
  const { data } = await api.get("/api/doctor/appointments");
  return (data.appointments ?? []) as DoctorAppointment[];
};

// PATCH /api/doctor/appointments/complete  { appointmentId }
export const completeDoctorAppointment = async (appointmentId: string) => {
  await api.patch("/api/doctor/appointments/complete", { appointmentId });
};

// PATCH /api/doctor/appointments/cancel  { appointmentId }
export const cancelDoctorAppointment = async (appointmentId: string) => {
  await api.patch("/api/doctor/appointments/cancel", { appointmentId });
};

// GET /api/doctor/consultations → { consultations }
export const getDoctorConsultations = async (): Promise<DoctorConsultation[]> => {
  const { data } = await api.get("/api/doctor/consultations");
  return (data.consultations ?? []) as DoctorConsultation[];
};

// PATCH /api/doctor/consultations/complete  { consultationId, userId }
export const completeDoctorConsultation = async (
  consultationId: string,
  userId: string,
) => {
  await api.patch("/api/doctor/consultations/complete", {
    consultationId,
    userId,
  });
};

// PATCH /api/doctor/consultations/cancel  { consultationId, userId }
export const cancelDoctorConsultation = async (
  consultationId: string,
  userId: string,
) => {
  await api.patch("/api/doctor/consultations/cancel", { consultationId, userId });
};

// ── Patients ───────────────────────────────────────────
export interface PatientHit {
  _id: string; // appointment id
  userId: string;
  userData?: { name?: string; phone?: string; nationalId?: string };
  slotDate?: string;
  slotTime?: string;
}

// POST /api/doctor/search  { q } → { user: PatientHit[] }
export const searchPatients = async (q: string): Promise<PatientHit[]> => {
  const { data } = await api.post("/api/doctor/search", { q });
  return (data.user ?? []) as PatientHit[];
};

// ── Reports ────────────────────────────────────────────
export interface ReportTreatment {
  name: string;
  dosage?: string;
  duration?: string;
}

export interface DoctorReport {
  _id: string;
  userData?: { name?: string };
  complaint: string;
  examination: string;
  diagnosis: string;
  treatment?: ReportTreatment[];
  notes?: string;
  nextVisit?: string;
  createdAt: string;
}

export interface NewReportInput {
  appointmentId: string;
  complaint: string;
  examination: string;
  diagnosis: string;
  treatment: ReportTreatment[];
  notes?: string;
  nextVisit?: string;
}

// GET /api/doctor/reports → { reports: DoctorReport[] }
export const getDoctorReports = async (): Promise<DoctorReport[]> => {
  const { data } = await api.get("/api/doctor/reports");
  return (data.reports ?? []) as DoctorReport[];
};

// POST /api/doctor/reports  (appointment must be completed)
export const addDoctorReport = async (input: NewReportInput) => {
  const { data } = await api.post("/api/doctor/reports", input);
  return data.report;
};

// PUT /api/doctor/reports  { reportId, ...fields }
export const editDoctorReport = async (
  reportId: string,
  input: Omit<NewReportInput, "appointmentId">,
) => {
  await api.put("/api/doctor/reports", { reportId, ...input });
};

// DELETE /api/doctor/reports  { reportId }
export const deleteDoctorReport = async (reportId: string) => {
  await api.delete("/api/doctor/reports", { data: { reportId } });
};

// DELETE /api/doctor/slots — clear all booked slots
export const clearDoctorSlots = async () => {
  await api.delete("/api/doctor/slots");
};

export interface NewConsultationInput {
  userId: string;
  appointmentId: string;
  consultDay: string; // YYYY-MM-DD (must be after the appointment day)
  consultTime: string; // HH:MM
  amount: number;
  notes?: string;
}

// POST /api/doctor/consultations  (from a completed appointment)
export const createDoctorConsultation = async (input: NewConsultationInput) => {
  const { data } = await api.post("/api/doctor/consultations", input);
  return data.consultation ?? data.data;
};
