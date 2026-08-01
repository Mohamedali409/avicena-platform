import { api } from "@/lib/api/client";
import type { ChatMessage, Conversation, ChatRequest } from "./types";

// Chat REST client — history + gating helpers. Real-time send/receive goes
// through the socket (see useChat). Responses are `{ success, message, ...data }`.

// GET /api/chat/room/:otherId/id → { roomId }
export const getRoomId = async (otherId: string): Promise<string> => {
  const { data } = await api.get(`/api/chat/room/${otherId}/id`);
  return data.roomId as string;
};

// GET /api/chat/room/:roomId?page&limit → { message: ChatMessage[] } (chronological)
export const getRoomMessages = async (
  roomId: string,
  page = 1,
  limit = 30,
): Promise<ChatMessage[]> => {
  const { data } = await api.get(`/api/chat/room/${roomId}`, {
    params: { page, limit },
  });
  return (data.message ?? []) as ChatMessage[];
};

// GET /api/chat/conversations → { conversations }
// Backend rows are aggregate groups: { _id: roomId, lastMessage: <full msg doc>,
// unreadCount }. Normalize to a flat, render-safe shape (lastMessage as string).
export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get("/api/chat/conversations");
  const rows = (data.conversations ?? []) as Array<{
    _id: string;
    lastMessage?: { message?: string; createdAt?: string };
    unreadCount?: number;
  }>;
  return rows.map((r) => ({
    roomId: r._id,
    lastMessage: r.lastMessage?.message,
    lastMessageAt: r.lastMessage?.createdAt,
    unread: r.unreadCount ?? 0,
  }));
};

// GET /api/chat/room/:roomId/unread → { count }
export const getUnreadCount = async (roomId: string): Promise<number> => {
  const { data } = await api.get(`/api/chat/room/${roomId}/unread`);
  return (data.count ?? 0) as number;
};

// GET /api/chat/room/:roomId/read → mark this room read
export const markRoomRead = async (roomId: string): Promise<void> => {
  await api.get(`/api/chat/room/${roomId}/read`);
};

// POST /api/chat/upload-voice (multipart "audio") → { url } (relative to API host)
export const uploadVoice = async (blob: Blob): Promise<string> => {
  const ext = blob.type.includes("mp4") || blob.type.includes("mpeg") ? "mp4" : "webm";
  const form = new FormData();
  form.append("audio", blob, `voice-${Date.now()}.${ext}`);
  const { data } = await api.post("/api/chat/upload-voice", form);
  return data.url as string;
};

// ── Chat requests (legacy gate — booking is the primary gate now) ──────────

// POST /api/chat/request  { docId, initialMessage }  (patient)
export const sendChatRequest = async (
  docId: string,
  initialMessage: string,
): Promise<ChatRequest> => {
  const { data } = await api.post("/api/chat/request", { docId, initialMessage });
  return (data.request ?? data.data) as ChatRequest;
};

// POST /api/chat/my-requests  (patient)
export const getMyChatRequests = async (): Promise<ChatRequest[]> => {
  const { data } = await api.post("/api/chat/my-requests", {});
  return (data.request ?? []) as ChatRequest[];
};

// POST /api/chat/doctor/requests  (doctor)
export const getDoctorChatRequests = async (
  status?: ChatRequest["status"],
): Promise<ChatRequest[]> => {
  const { data } = await api.post("/api/chat/doctor/requests", null, {
    params: status ? { status } : undefined,
  });
  return (data.requests ?? []) as ChatRequest[];
};

// POST /api/chat/doctor/request/accept  { roomId }  (doctor)
export const acceptChatRequest = async (roomId: string) => {
  const { data } = await api.post("/api/chat/doctor/request/accept", { roomId });
  return data.data;
};

// POST /api/chat/doctor/request/reject  { roomId, rejectReason }  (doctor)
export const rejectChatRequest = async (roomId: string, rejectReason = "") => {
  const { data } = await api.post("/api/chat/doctor/request/reject", {
    roomId,
    rejectReason,
  });
  return data.request;
};
