"use client";

import { createContext, useContext } from "react";
import { useVideoCall } from "./useVideoCall";
import { CallScreen } from "./components/CallScreen";
import { IncomingCallModal } from "./components/IncomingCallModal";
import type { ParticipantType, CallType } from "@/lib/socket/events";
import type { CallStatus } from "./types";

interface CallContextValue {
  status: CallStatus;
  startCall: (
    receiverId: string,
    receiverType: ParticipantType,
    type?: CallType,
    consultationId?: string,
  ) => Promise<void>;
}

const CallContext = createContext<CallContextValue | null>(null);

// Mount ONCE high in a role's tree (e.g. patient/doctor layout). Holds the
// single useVideoCall instance so incoming calls are caught anywhere, renders
// the ringing modal + in-call screen, and exposes startCall to descendants.
export function CallProvider({ children }: { children: React.ReactNode }) {
  const call = useVideoCall();

  const showCallScreen =
    call.status === "calling" ||
    call.status === "connecting" ||
    call.status === "in-call";

  return (
    <CallContext.Provider
      value={{ status: call.status, startCall: call.startCall }}
    >
      {children}

      {call.incomingCall && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={call.acceptCall}
          onReject={call.rejectCall}
        />
      )}

      {showCallScreen && (
        <CallScreen
          status={call.status}
          localStream={call.localStream}
          remoteStream={call.remoteStream}
          micOn={call.micOn}
          camOn={call.camOn}
          onToggleMic={call.toggleMic}
          onToggleCam={call.toggleCam}
          onEnd={call.endCall}
        />
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
