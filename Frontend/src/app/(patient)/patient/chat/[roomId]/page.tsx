"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ChatRoom } from "@/features/chat/components/ChatRoom";
import { useCall } from "@/features/video/CallProvider";
import { useAuth } from "@/store/auth.store";

// Chat room screen. roomId comes from the URL; the doctor's name can be passed
// as ?name= for the header. selfId is read from the stored session. The call
// button starts a video call with the other participant (the doctor).
export default function PatientChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const search = useSearchParams();
  const selfId = useAuth((s) => s.session?.user._id ?? null);
  const { startCall } = useCall();

  const title = search.get("name") ?? undefined;
  if (!roomId) return null;

  const doctorId =
    selfId ? roomId.split("_").find((id) => id !== selfId) : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <ChatRoom
        roomId={roomId}
        selfId={selfId}
        title={title}
        onStartCall={
          doctorId ? () => startCall(doctorId, "doctor", "video") : undefined
        }
      />
    </div>
  );
}
