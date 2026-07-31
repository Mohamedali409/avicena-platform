import { api } from "@/lib/api/client";

// Lab self-service client. Mirrors /api/lab/* (labGuard for own profile).
// Responses are `{ success, message, ...data }`.

export interface LabTest {
  name: string;
  price: number;
  duration?: string;
  description?: string;
}

export interface LabProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  address?: { line1?: string; line2?: string; city?: string };
  certifications?: string[];
  tests?: LabTest[];
  workingHours?: { from: string; to: string };
  isVerified?: boolean;
  isActive?: boolean;
}

// GET /api/lab/me/profile → { lab }  (labGuard)
export const getLabProfile = async (): Promise<LabProfile> => {
  const { data } = await api.get("/api/lab/me/profile");
  return (data.lab ?? data.data) as LabProfile;
};

export interface LabProfileInput {
  name?: string;
  phone?: string;
  address?: { line1?: string; line2?: string; city?: string };
  workingHours?: { from?: string; to?: string };
  image?: File | null;
}

// PUT /api/lab/me/profile — multipart. Only name/phone/address/workingHours/image
// are editable (the backend does NOT accept tests here).
export const updateLabProfile = async (input: LabProfileInput) => {
  const fd = new FormData();
  if (input.name) fd.append("name", input.name);
  if (input.phone) fd.append("phone", input.phone);
  if (input.address) fd.append("address", JSON.stringify(input.address));
  if (input.workingHours)
    fd.append("workingHours", JSON.stringify(input.workingHours));
  if (input.image) fd.append("image", input.image);
  await api.put("/api/lab/me/profile", fd);
};
