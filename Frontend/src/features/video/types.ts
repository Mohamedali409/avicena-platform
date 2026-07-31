import type { ParticipantType, CallType } from "@/lib/socket/events";

export type CallStatus =
  | "idle"
  | "calling" // we initiated, waiting for the other side
  | "ringing" // an incoming call is ringing for us
  | "connecting" // accepted, negotiating WebRTC
  | "in-call"
  | "ended";

export interface IncomingCall {
  callId: string; // the call document id (used to accept/reject)
  roomId: string;
  from: string; // caller's userId
  callerType: ParticipantType;
  type: CallType;
}

export interface CallRecord {
  _id: string;
  roomId: string;
  callerId: string;
  callerType: ParticipantType;
  receiverId: string;
  receiverType: ParticipantType;
  type: CallType;
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected";
  durationInSeconds: number;
  createdAt: string;
}
