import { api } from "@/lib/api/client";
import type { CallRecord } from "./types";

// GET /api/video-call/history?page&limit
export const getCallHistory = async (page = 1, limit = 20) => {
  const { data } = await api.get("/api/video-call/history", {
    params: { page, limit },
  });
  return (data.history ?? data.data ?? data.calls ?? []) as CallRecord[];
};

// GET /api/video-call/:id
export const getCall = async (id: string): Promise<CallRecord> => {
  const { data } = await api.get(`/api/video-call/${id}`);
  return (data.call ?? data.data) as CallRecord;
};
