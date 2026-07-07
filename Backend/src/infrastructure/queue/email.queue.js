import { Queue, Worker } from "bullmq";
import { redisConnection } from "./bullmq.connection.js";
import {
  sendWelcomeEmail,
  sendAppointmentEmail,
  sendConsultationEmail,
  sendReportEmail,
} from "../mail/mail.service.js";

const QUEUE_NAME = "email-queue";

// ── Queue  ──────────────────────────────────────

const emailQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// ── Helper functions ────────────

const queueWelcomeEmail = (email, name) =>
  emailQueue.add("welcome", { email, name });

const queueAppointmentEmail = (email, name, appointment, docData) =>
  emailQueue.add("appointment", { email, name, appointment, docData });

const queueConsultationEmail = (
  email,
  name,
  docData,
  consultDay,
  consultTime,
  notes,
) =>
  emailQueue.add("consultation", {
    email,
    name,
    docData,
    consultDay,
    consultTime,
    notes,
  });

const queueReportEmail = (email, report) =>
  emailQueue.add("report", { email, report });

// ── Worker  ─────────────────────────────────────

const startEmailWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const { name, data } = job;

      switch (name) {
        case "welcome":
          await sendWelcomeEmail(data.email, data.name);
          break;
        case "appointment":
          await sendAppointmentEmail(
            data.email,
            data.name,
            data.appointment,
            data.docData,
          );
          break;
        case "consultation":
          await sendConsultationEmail(
            data.email,
            data.name,
            data.docData,
            data.consultDay,
            data.consultTime,
            data.notes,
          );
          break;
        case "report":
          await sendReportEmail(data.email, data.report);
          break;
        default:
          throw new Error(`Unknown job type : ${name}`);
      }
    },
    { connection: redisConnection, concurrency: 3 },
  );

  worker.on("completed", (job) =>
    console.log(`Email sent : [${job.name}] to ${job.data.email}`),
  );
  worker.on("failed", (job, err) =>
    console.log(`Email failed: [${job?.name}] ـ ${err.message}`),
  );

  console.log("Email worker started");
  return worker;
};

export {
  emailQueue,
  queueWelcomeEmail,
  queueAppointmentEmail,
  queueConsultationEmail,
  queueReportEmail,
  startEmailWorker,
};
