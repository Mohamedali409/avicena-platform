import Cerebras from "@cerebras/cerebras_cloud_sdk/index.mjs";
import { searchReports, indexAllReportsForUser } from "./rag.service.js";
import Report from "../../modules/report/report.model.js";

const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

const SYSTEM_PROMPT = `You are an intelligent medical assistant designed to support physicians during patient consultations.

Your responsibilities:
- Analyze the patient's previous medical reports and provide a clear, concise summary.
- Answer the physician's questions based only on the patient's medical history and the available medical reports.
- Highlight any critical information, including current medications, allergies, chronic conditions, abnormal findings, and previous diagnoses.
- If the requested information is not found in the available reports, respond with:
  "There is no information about this in the available reports."

Important rules:
- Never invent, infer, or assume any medical information.
- Every response must be based solely on the provided medical reports.
- Use clear, accurate, and professional medical language.
- Do not provide a final diagnosis, prescribe medications, or replace clinical judgment.
- If the available information is insufficient to answer the question, clearly state that the reports do not contain enough information.
- When possible, reference the relevant medical report or report date that supports your answer.`;

export const generatePatientSummary = async (userId) => {
  const reports = await Report.find({ userId });

  if (!reports.length) {
    return {
      summary: "No previous medical records are available.",
      reportsCount: 0,
    };
  }

  await indexAllReportsForUser(reports);

  return {
    summary: `${reports.length} reports indexed successfully.`,
    reportsCount: reports.length,
  };
};
/**
 * الدكتور يسأل سؤال عن المريض
 */

export const askAboutPatient = async (userId, question, chatHistory = []) => {
  const reports = await Report.find({ userId });

  if (!reports.length) {
    return "There are no available medical reports to answer this question.";
  }

  await indexAllReportsForUser(reports);

  const relevantChunks = await searchReports(question, userId, 5);

  if (!relevantChunks.length) {
    return "There are no available medical reports to answer this question.";
  }
};
