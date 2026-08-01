"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useVideoCall } from "./useVideoCall";
import { IncomingCallModal } from "./components/IncomingCallModal";
import { useAuth } from "@/store/auth.store";

type CallContextValue = ReturnType<typeof useVideoCall>;

const CallContext = createContext<CallContextValue | null>(null);

// Mount ONCE high in a role's tree (e.g. patient/doctor layout). Holds the
// single useVideoCall instance so incoming calls are caught anywhere, renders
// the ringing modal globally, and exposes the whole call controller to
// descendants. The in-call video is rendered INSIDE the chat page via
// <CallPanel/> (see ./CallPanel), not as a full-screen overlay.
export function CallProvider({ children }: { children: React.ReactNode }) {
  const call = useVideoCall();
  const router = useRouter();
  const queryClient = useQueryClient();
  const role = useAuth((s) => s.session?.role);
  const selfId = useAuth((s) => s.session?.user._id ?? null);

  // When a call ends, refresh the call log so the new entry shows inline in the
  // chat thread (and in the conversations list) without a manual reload.
  useEffect(() => {
    if (call.status === "ended") {
      queryClient.invalidateQueries({ queryKey: ["call-history"] });
    }
  }, [call.status, queryClient]);

  // When a call is accepted from the global ringing modal, route the callee to
  // the chat room with the caller so the embedded call panel is visible.
  const onAccept = async () => {
    const peerId = call.incomingCall?.from;
    await call.acceptCall();
    if (peerId && selfId && (role === "patient" || role === "doctor")) {
      const chatRoom = [selfId, peerId].sort().join("_");
      router.push(`/${role}/chat/${chatRoom}`);
    }
  };

  return (
    <CallContext.Provider value={call}>
      {children}

      {call.incomingCall && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={onAccept}
          onReject={call.rejectCall}
        />
      )}

      {/* Surface call errors — previously these were swallowed, so a failed
          getUserMedia (camera busy / permission denied) looked like "nothing
          happens" when the call button was pressed. */}
      {call.error && (
        <div
          role="alert"
          className="fixed bottom-4 left-1/2 z-[80] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-lg bg-error px-4 py-3 text-sm text-white shadow-card"
        >
          <span className="material-symbols-outlined text-[18px]">error</span>
          {call.error}
        </div>
      )}
    </CallContext.Provider>
  );
}

// Access the shared call controller from any descendant of CallProvider.
export function useCall(): CallContextValue {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used within <CallProvider>");
  return ctx;
}
