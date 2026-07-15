import { Queue, Worker } from "bullmq";
import { redisConnection } from "./bullmq.connection.js";
import { queueMedicationEmail } from "./email.queue.js";

const QUEUE_NAME = "medication-queue";

// ── Queue ─────────────────────────────────────────────────
const medicationQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 200,
    removeOnFail: 100,
  },
});

// Schedule a single dose reminder with a delay (ms). `jobId` makes it
// idempotent so re-scheduling a plan doesn't duplicate reminders.
const scheduleReminder = (data, delayMs, jobId) =>
  medicationQueue.add("reminder", data, { delay: delayMs, jobId });

// Given a schedule doc, enqueue one delayed job per dose occurrence.
// Capped to avoid unbounded fan-out for very long courses.
const MAX_OCCURRENCES = 120;

const scheduleForPlan = async (schedule) => {
  const now = Date.now();
  let scheduled = 0;

  for (const med of schedule.medications) {
    const start = new Date(med.startDate || Date.now());
    const times = (med.times || []).filter(Boolean);
    const days = Math.max(1, Number(med.days) || 1);

    for (let d = 0; d < days; d++) {
      for (const t of times) {
        if (scheduled >= MAX_OCCURRENCES) break;
        const [hh, mm] = String(t)
          .split(":")
          .map((x) => parseInt(x, 10));
        if (Number.isNaN(hh)) continue;

        const fire = new Date(start);
        fire.setHours(hh, mm || 0, 0, 0);
        fire.setDate(fire.getDate() + d);

        const delay = fire.getTime() - now;
        if (delay <= 0) continue; // past occurrence, skip

        const jobId = `${schedule._id}:${med._id}:${d}:${t}`;
        await scheduleReminder(
          {
            scheduleId: String(schedule._id),
            userId: String(schedule.userId),
            medName: med.name,
            dosage: med.dosage,
            time: t,
            channels: schedule.channels,
          },
          delay,
          jobId,
        );
        scheduled++;
      }
    }
  }
  return scheduled;
};

// ── Worker ────────────────────────────────────────────────
const startMedicationWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      if (job.name !== "reminder") return;
      const { scheduleId, userId, medName, dosage, time, channels } = job.data;

      // Lazy imports keep the queue module free of app-model load-order issues.
      const { findActiveById } =
        await import("../../modules/medication/medication.repository.js");
      const { pushNotification } =
        await import("../../modules/notifications/notification.service.js");

      // If the plan was cancelled, silently skip.
      const schedule = await findActiveById(scheduleId);
      if (!schedule) return;

      const message = `حان موعد جرعة ${medName}${dosage ? ` (${dosage})` : ""} الساعة ${time}`;

      if (channels?.inApp !== false) {
        await pushNotification({
          recipientId: userId,
          recipientType: "user",
          type: "medication",
          title: "تذكير بموعد الدواء 💊",
          message,
          data: { scheduleId, medName, time },
        });
      }

      if (channels?.email !== false) {
        const { getUserById } =
          await import("../../modules/User/user.repository.js");
        const user = await getUserById(userId);
        if (user?.email)
          await queueMedicationEmail(user.email, user.name, {
            medName,
            dosage,
            time,
          });
      }
    },
    { connection: redisConnection, concurrency: 5 },
  );

  worker.on("failed", (job, err) =>
    console.log(`Medication reminder failed: ${err.message}`),
  );
  console.log("Medication worker started");
  return worker;
};

export { medicationQueue, scheduleForPlan, startMedicationWorker };
