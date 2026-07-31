// Single source of truth for the Socket.io event contract, mirroring the
// backend (see Backend/CHAT_VIDEO_FIXES.md §3). Import these constants instead
// of hard-coding event strings so a rename is caught by TypeScript.

export const SOCKET_EVENTS = {
  // ── Presence ──────────────────────────────────────────
  presenceCheck: "presence:check", // C→S { userId }
  presenceStatus: "presence:status", // S→C { userId, online }
  presenceOnline: "presence:online", // S→C { userId }
  presenceOffline: "presence:offline", // S→C { userId }

  // ── Chat ──────────────────────────────────────────────
  chatJoin: "chat:join", // C→S roomId
  chatLeave: "chat:leave", // C→S roomId
  chatMessage: "chat:message", // C→S {roomId,receiverId,message} / S→C message
  chatMessageSent: "chat:message:sent", // S→C message (echo to sender)
  chatTyping: "chat:typing", // both { roomId, senderId? }
  chatStopTyping: "chat:stopTyping", // both { roomId, senderId? }
  chatRead: "chat:read", // C→S {roomId} / S→C {roomId, readerId}
  chatError: "chat:error", // S→C { message }

  // ── Video (WebRTC signaling) ──────────────────────────
  callInitiate: "call:initiate", // C→S { receiverId, receiverType, consultationId?, type }
  callInitiated: "call:initiated", // S→C { callId, roomId }
  callIncoming: "call:incoming", // S→C { callerId, roomId, from, callerType, type }
  callAccept: "call:accept", // C→S { callId, roomId }
  callAccepted: "call:accepted", // S→C { callId, roomId, from }
  callReject: "call:reject", // C→S { callId, targetId }
  callRejected: "call:rejected", // S→C { callId, from }
  callEnd: "call:end", // C→S { callId, roomId?, targetId? }
  callEnded: "call:ended", // S→C { callId, from, duration }
  callOffer: "call:offer", // C→S {targetId,offer,roomId} / S→C {from,offer,roomId}
  callAnswer: "call:answer", // C→S {targetId,answer,roomId} / S→C {from,answer,roomId}
  callIce: "call:ice-candidate", // both { targetId|from, candidate, roomId }
  callError: "call:error", // S→C { message }

  // ── Notifications ─────────────────────────────────────
  notifFetchUnread: "notification:fetchUnread", // C→S
  notifUnreadCount: "notification:UnreadCount", // S→C { count }
  notifMarkAllRead: "notification:markAllRead", // C→S
  notifAllRead: "notification:allRead", // S→C
  notifNew: "notification:new", // S→C notification
  notifError: "notification:error", // S→C { message }
} as const;

export type ParticipantType = "user" | "doctor";
export type CallType = "video" | "audio";
