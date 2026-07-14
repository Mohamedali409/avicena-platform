import { api } from "@/lib/api/client";

// Doctor-only Medical AI (RAG) client. Mirrors /api/medical-ai/*.
// The auth interceptor attaches the `dtoken` header automatically for doctors.

export interface ChatTurn { role: "user" | "assistant"; content: string; }

export const getPatientSummary = async (userId: string) => {
  const { data } = await api.get(`/api/medical-ai/summary/${userId}`);
  return data.data as { summary: string; reportsCount: number };
};

export const askAboutPatient = async (
  userId: string,
  question: string,
  chatHistory: ChatTurn[] = [],
) => {
  const { data } = await api.post("/api/medical-ai/ask", { userId, question, chatHistory });
  return data.data as { answer: string };
};
