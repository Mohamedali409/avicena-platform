import { api } from "@/lib/api/client";

export interface LabTest { name: string; price: number; duration?: string; description?: string; }
export interface Lab {
  _id: string;
  name: string;
  image?: string;
  phone?: string;
  address?: { line1?: string; line2?: string; city?: string };
  tests?: LabTest[];
  workingHours?: { from?: string; to?: string };
  certifications?: string[];
  isVerified?: boolean;
}

// Public listing — GET /api/lab (backend spreads payload at top level).
export const getLabs = async (): Promise<Lab[]> => {
  try {
    const { data } = await api.get("/api/lab");
    return (data.labs ?? data.data ?? []) as Lab[];
  } catch {
    return [];
  }
};

// Public single lab — GET /api/lab/:id
export const getLabById = async (id: string): Promise<Lab | null> => {
  try {
    const { data } = await api.get(`/api/lab/${id}`);
    return (data.lab ?? data.data ?? null) as Lab | null;
  } catch {
    return null;
  }
};
