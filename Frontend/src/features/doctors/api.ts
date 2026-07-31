import { api } from "@/lib/api/client";

export interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  degree?: string;
  expertise?: string;
  about?: string;
  fees: number;
  consultation_fees?: number;
  image?: string;
  available?: boolean;
  address?: { line1?: string; line2?: string; city?: string };
  start_booked?: { from: number; to: number; booking_period: number };
}

// Public listing — GET /api/doctor/list. Backend spreads payload at top level,
// so accept a few shapes defensively.
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data } = await api.get("/api/doctor/list");
    return (data.doctor ?? data.doctors ?? data.data ?? []) as Doctor[];
  } catch {
    return [];
  }
};

// There is no public single-doctor endpoint, so resolve from the list by id.
export const getDoctor = async (id: string): Promise<Doctor | null> => {
  const doctors = await getDoctors();
  return doctors.find((d) => d._id === id) ?? null;
};
