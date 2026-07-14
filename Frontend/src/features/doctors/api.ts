import { api } from "@/lib/api/client";

export interface Doctor {
  _id: string;
  doctorName: string;
  Specialization: string;
  degree?: string;
  expertise?: string;
  about?: string;
  fees: number;
  consultation_fees?: number;
  image?: string;
  available?: boolean;
}

// Public listing — GET /api/doctor/list. Backend spreads payload at top level,
// so accept a few shapes defensively.
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data } = await api.get("/api/doctor/list");
    return (data.doctors ?? data.data ?? []) as Doctor[];
  } catch {
    return [];
  }
};
