import { api } from "@/lib/api/client";

// Doctor-only Medical AI (RAG) client. Mirrors /api/medical-ai/* (doctorGuard,
// cookie-based). Responses are `{ success, message, ...data }`.

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface PatientSummary {
  summary: string;
  reportsCount: number;
}

// GET /api/medical-ai/summary/:userId → { ai: { summary, reportsCount } }
export const getPatientSummary = async (
  userId: string,
): Promise<PatientSummary> => {
  const { data } = await api.get(`/api/medical-ai/summary/${userId}`);
  return (data.ai ?? data.data) as PatientSummary;
};

// POST /api/medical-ai/ask → { answer, question }
export const askAboutPatient = async (
  userId: string,
  question: string,
  chatHistory: ChatTurn[] = [],
): Promise<string> => {
  const { data } = await api.post("/api/medical-ai/ask", {
    userId,
    question,
    chatHistory,
  });
  return (data.answer ?? data.data?.answer ?? "") as string;
};
