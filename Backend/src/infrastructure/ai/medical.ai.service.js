import Cerebras from "@cerebras/cerebras_cloud_sdk/index.mjs";
import { searchReports } from "./rag.service.js";
import Report from "../../modules/report/report.model.js";

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

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

/**
 * Generate a simple summary about patient's reports
 */
export const generatePatientSummary = async (userId) => {
  const reports = await Report.find({ userId }).sort({ createdAt: -1 });

  if (!reports.length) {
    return {
      summary: "No previous medical records are available.",
      reportsCount: 0,
    };
  }

  return {
    summary: `${reports.length} medical report(s) available.`,
    reportsCount: reports.length,
  };
};

/**
 * Answer doctor's question using RAG
 */
export const askAboutPatient = async (userId, question, chatHistory = []) => {
  try {
    const relevantChunks = await searchReports(question, userId, 5);

    console.log("Relevant Chunks:", relevantChunks.length);

    if (!relevantChunks.length) {
      return "There are no available medical reports to answer this question.";
    }

    const context = relevantChunks
      .map(
        (chunk) =>
          `[${chunk.section} - ${new Date(chunk.date).toLocaleDateString(
            "ar-EG",
          )}]\n${chunk.text}`,
      )
      .join("\n\n-------------------------\n\n");

    console.log("Context:\n", context);

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...chatHistory.slice(-6),
      {
        role: "user",
        content: `Context retrieved from the patient's medical records:

${context}

Based ONLY on the information above, answer the physician's question.

If the answer is not found in the reports, explicitly say that it is unavailable.

Physician's Question:
${question}`,
      },
    ];

    console.log("Using model: gpt-oss-120b");

    const response = await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages,
      max_tokens: 600,
    });

    const answer = response.choices[0].message.content;

    console.log("AI Answer:\n", answer);

    return answer;
  } catch (error) {
    console.error("Medical AI Error:", error);
    throw error;
  }
};
