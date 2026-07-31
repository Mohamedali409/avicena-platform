"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { getRoomMessages, markRoomRead } from "./api";
import type { ChatMessage } from "./types";

interface UseChatArgs {
  roomId: string | null;
  /** the other participant's id — required so the backend can gate + notify */
  receiverId: string | null;
  /** current user's id — to tell own messages from the peer's */
  selfId: string | null;
}

interface UseChatResult {
  messages: ChatMessage[];
  loadingHistory: boolean;
  error: string | null;
  peerTyping: boolean;
  sendMessage: (text: string) => void;
  notifyTyping: () => void;
}

let tempSeq = 0;

export function useChat({ roomId, receiverId, selfId }: UseChatArgs): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Load history + join/leave the room, and wire socket listeners.
  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket();
    let cancelled = false;

    setLoadingHistory(true);
    setError(null);
    getRoomMessages(roomId)
      .then((history) => {
        if (!cancelled) setMessages(history);
      })
      .catch(() => {
        if (!cancelled) setError("تعذّر تحميل الرسائل");
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    socket.emit(SOCKET_EVENTS.chatJoin, roomId);
    markRoomRead(roomId).catch(() => {});
    socket.emit(SOCKET_EVENTS.chatRead, { roomId });

    const onIncoming = (msg: ChatMessage) => {
      if (msg.roomId !== roomId) return;
      setMessages((prev) => [...prev, msg]);
      setPeerTyping(false);
      // we're looking at the room — mark the peer's message read
      socket.emit(SOCKET_EVENTS.chatRead, { roomId });
    };

    const onSentEcho = (msg: ChatMessage) => {
      if (msg.roomId !== roomId) return;
      // replace the oldest matching optimistic message, else append
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m.pending && m.message === msg.message,
        );
        if (idx === -1) return [...prev, msg];
        const next = [...prev];
        next[idx] = msg;
        return next;
      });
    };

    const onTyping = (p: { roomId: string; senderId: string }) => {
      if (p.roomId !== roomId || p.senderId === selfId) return;
      setPeerTyping(true);
      if (peerTypingTimeout.current) clearTimeout(peerTypingTimeout.current);
      peerTypingTimeout.current = setTimeout(() => setPeerTyping(false), 4000);
    };

    const onStopTyping = (p: { roomId: string }) => {
      if (p.roomId !== roomId) return;
      setPeerTyping(false);
    };

    const onRead = (p: { roomId: string; readerId: string }) => {
      if (p.roomId !== roomId || p.readerId === selfId) return;
      // the peer read our messages → mark all own messages read
      setMessages((prev) =>
        prev.map((m) => (m.senderId === selfId ? { ...m, isRead: true } : m)),
      );
    };

    const onError = (p: { message: string }) => setError(p.message);

    socket.on(SOCKET_EVENTS.chatMessage, onIncoming);
    socket.on(SOCKET_EVENTS.chatMessageSent, onSentEcho);
    socket.on(SOCKET_EVENTS.chatTyping, onTyping);
    socket.on(SOCKET_EVENTS.chatStopTyping, onStopTyping);
    socket.on(SOCKET_EVENTS.chatRead, onRead);
    socket.on(SOCKET_EVENTS.chatError, onError);

    return () => {
      cancelled = true;
      socket.emit(SOCKET_EVENTS.chatLeave, roomId);
      socket.off(SOCKET_EVENTS.chatMessage, onIncoming);
      socket.off(SOCKET_EVENTS.chatMessageSent, onSentEcho);
      socket.off(SOCKET_EVENTS.chatTyping, onTyping);
      socket.off(SOCKET_EVENTS.chatStopTyping, onStopTyping);
      socket.off(SOCKET_EVENTS.chatRead, onRead);
      socket.off(SOCKET_EVENTS.chatError, onError);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (peerTypingTimeout.current) clearTimeout(peerTypingTimeout.current);
    };
  }, [roomId, selfId]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !roomId || !selfId) return;
      const socket = getSocket();

      // optimistic message — reconciled by the chat:message:sent echo
      const optimistic: ChatMessage = {
        _id: `tmp-${++tempSeq}`,
        roomId,
        senderId: selfId,
        senderType: "user",
        message: trimmed,
        isRead: false,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      socket.emit(SOCKET_EVENTS.chatMessage, {
        roomId,
        receiverId,
        message: trimmed,
      });

      // stop the typing indicator once a message is sent
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socket.emit(SOCKET_EVENTS.chatStopTyping, { roomId });
      }
    },
    [roomId, receiverId, selfId],
  );

  // Debounced typing: emit "typing" on keystrokes, "stopTyping" after a pause.
  const notifyTyping = useCallback(() => {
    if (!roomId) return;
    const socket = getSocket();

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit(SOCKET_EVENTS.chatTyping, { roomId });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit(SOCKET_EVENTS.chatStopTyping, { roomId });
    }, 1500);
  }, [roomId]);

  return {
    messages,
    loadingHistory,
    error,
    peerTyping,
    sendMessage,
    notifyTyping,
  };
}
