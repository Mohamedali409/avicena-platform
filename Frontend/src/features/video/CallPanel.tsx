"use client";

import { useCall } from "./CallProvider";
import { CallScreen } from "./components/CallScreen";

// Renders the active call INSIDE the chat page (above the conversation) instead
// of a full-screen overlay. Shows nothing when there's no active call.
export function CallPanel({ title }: { title?: string }) {
  const call = useCall();

  const active =
    call.status === "calling" ||
    call.status === "connecting" ||
    call.status === "in-call";

  if (!active) return null;

  return (
    <div className="mb-3">
      <CallScreen
        embedded
        status={call.status}
        localStream={call.localStream}
        remoteStream={call.remoteStream}
        micOn={call.micOn}
        camOn={call.camOn}
        title={title}
        onToggleMic={call.toggleMic}
        onToggleCam={call.toggleCam}
        onEnd={call.endCall}
      />
    </div>
  );
}
