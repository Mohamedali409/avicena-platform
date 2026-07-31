import { api } from "@/lib/api/client";

export interface AppNotification {
  _id: string;
  recipientId: string;
  recipientType: "user" | "doctor";
  type: string; // "chat" | "chat_request" | "consultation" | ...
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// GET /api/notifications?page&limit&type
export const getNotifications = async (page = 1, limit = 20, type?: string) => {
  const { data } = await api.get("/api/notifications", {
    params: { page, limit, ...(type ? { type } : {}) },
  });
  return data.data ?? data;
};

// GET /api/notifications/unread  (fallback to socket for live updates)
export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/api/notifications/unread");
  return (data.count ?? 0) as number;
};

// PATCH /api/notifications/read-all
export const markAllRead = async () => {
  await api.patch("/api/notifications/read-all");
};

// PATCH /api/notifications/:id/read
export const markOneRead = async (id: string) => {
  await api.patch(`/api/notifications/${id}/read`);
};
