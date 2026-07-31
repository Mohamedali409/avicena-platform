"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ChatRoom } from "@/features/chat/components/ChatRoom";
import { MedicalAIPanel } from "@/features/medical-ai/MedicalAIPanel";
import { useCall } from "@/features/video/CallProvider";
import { useAuth } from "@/store/auth.store";

// Doctor's chat room with a patient + the Medical-AI assistant side panel.
export default function DoctorChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const search = useSearchParams();
  const selfId = useAuth((s) => s.session?.user._id ?? null);
  const { startCall } = useCall();
  const [showAI, setShowAI] = useState(false);

  const title = search.get("name") ?? "محادثة المريض";
  if (!roomId) return null;

  const patientId = selfId
    ? roomId.split("_").find((id) => id !== selfId)
    : undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAI((s) => !s)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-label-md transition-colors ${
            showAI
              ? "bg-primary-container text-white"
              : "border border-outline-variant text-primary hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            neurology
          </span>
          {showAI ? "إخفاء المساعد الذكي" : "المساعد الطبي الذكي"}
        </button>
      </div>

      <div className={`grid gap-4 ${showAI ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        <ChatRoom
          roomId={roomId}
          selfId={selfId}
          title={title}
          onStartCall={
            patientId ? () => startCall(patientId, "user", "video") : undefined
          }
        />
        {showAI && patientId && <MedicalAIPanel patientId={patientId} />}
      </div>
    </div>
  );
}
