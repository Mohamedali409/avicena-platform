import type { ParticipantType } from "@/lib/socket/events";

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: string;
  senderType: ParticipantType;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  // client-only: set on optimistic messages before the server echo arrives
  pending?: boolean;
}

export interface Conversation {
  roomId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unread?: number;
  // the backend shape may vary; keep it open for the list UI
  [key: string]: unknown;
}

export type ChatRequestStatus = "pending" | "accepted" | "rejected";

export interface ChatRequest {
  _id: string;
  userId: string;
  docId: string;
  roomId: string;
  initialMessage: string;
  status: ChatRequestStatus;
  rejectReason?: string;
  createdAt: string;
}
