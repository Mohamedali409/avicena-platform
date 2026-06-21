export const SOCKET_EVENTS = {
  // Connection / presence
  CONNECT: "connection",
  DISCONNECT: "disconnect",

  // Chat
  CHAT_JOIN: "chat:join",
  CHAT_LEAVE: "chat:leave",
  CHAT_MESSAGE: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_STOP_TYPING: "chat:stopTyping",
  CHAT_READ: "chat:read",
  CHAT_ERROR: "chat:error",

  // Video call lifecycle
  CALL_INITIATE: "call:initiate",
  CALL_INITIATED: "call:initiated",
  CALL_INCOMING: "call:incoming",
  CALL_ACCEPT: "call:accept",
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECT: "call:reject",
  CALL_REJECTED: "call:rejected",
  CALL_END: "call:end",
  CALL_ENDED: "call:ended",
  CALL_ERROR: "call:error",

  // WebRTC signaling
  CALL_OFFER: "call:offer",
  CALL_ANSWER: "call:answer",
  CALL_ICE_CANDIDATE: "call:ice-candidate",

  // Notifications
  NOTIFICATION_NEW: "notification:new",
};
