import ApiError from "../../shared/utils/ApiError.js";
import * as appointmentRepository from "./appointment.repository.js";

const getAppointmentById = async (appointmentId) => {
  const appointment = await appointmentRepository.findById(appointmentId);

  if (!appointment) throw new ApiError("The appointment is not found", 404);

  return appointment;
};

// Combine an appointment's slotDate ("YYYY-MM-DD") + slotTime ("HH:MM") into a
// Date in server-local time. Parses the ISO date parts directly to avoid the
// UTC-vs-local shift you get from `new Date("YYYY-MM-DD")`. Returns null when
// the values can't be parsed (caller then skips the time-window check).
const parseSlotDateTime = (slotDate, slotTime) => {
  const [h = 0, m = 0] = String(slotTime || "")
    .split(":")
    .map(Number);
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(slotDate));
  if (iso) {
    return new Date(+iso[1], +iso[2] - 1, +iso[3], h, m, 0, 0);
  }
  const d = new Date(slotDate);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0);
};

const isWithinWindow = (appointment, now) => {
  const start = parseSlotDateTime(appointment.slotDate, appointment.slotTime);
  if (!start) return true; // unparseable slot → don't block on the window

  const before = Number(process.env.CHAT_OPEN_BEFORE_MIN || 15);
  const after = Number(process.env.CHAT_OPEN_AFTER_MIN || 60);

  const open = start.getTime() - before * 60_000;
  const close = start.getTime() + after * 60_000;
  const t = now.getTime();
  return t >= open && t <= close;
};

// Gate for opening chat / video between a patient and a doctor.
// Rule: there must be an active (non-cancelled) appointment between them, and
// the current time must fall inside that appointment's window
// (slotTime - CHAT_OPEN_BEFORE_MIN ... slotTime + CHAT_OPEN_AFTER_MIN).
// Set CHAT_REQUIRE_TIME_WINDOW=false to require only that a booking exists
// (handy while testing without a slot at the current time).
// Returns the matched appointment.
const assertConsultationAccess = async (userId, docId) => {
  const appointments = await appointmentRepository.findActiveByUserAndDoctor(
    userId,
    docId,
  );

  if (!appointments.length) {
    throw new ApiError(
      "لا يوجد حجز مع هذا الطبيب — احجز موعدًا أولًا لفتح المحادثة",
      403,
    );
  }

  if (process.env.CHAT_REQUIRE_TIME_WINDOW === "false") {
    return appointments[0];
  }

  const now = new Date();
  const active = appointments.find((a) => isWithinWindow(a, now));
  if (!active) {
    throw new ApiError(
      "المحادثة تُفتح فقط قرب موعد الحجز المحدد",
      403,
    );
  }

  return active;
};

export { getAppointmentById, assertConsultationAccess };
