import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import {
  generatePatientSummary,
  askAboutPatient,
} from "../../infrastructure/ai/medical.ai.service.js";
import { indexReport } from "../../infrastructure/ai/rag.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import {
  ragRequestsTotal,
  ragResponseDurationMs,
} from "../../infrastructure/monitoring/metrics.service.js";

/**
 * الدكتور يفتح الـ chat مع مريض
 * → يولّد ملخص تلقائي عن حالة المريض
 * GET /api/medical-ai/summary/:userId
 */

export const getPatientSummary = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new ApiError("userId id required", 400);
  const start = Date.now();
  const data = await generatePatientSummary(userId);
  try {
    ragRequestsTotal.inc({ operation: "summary", status: "success" });
    ragResponseDurationMs.observe({ operation: "summary" }, Date.now() - start);
    successResponse(res, "Patient medical records analyzed successfully.", {
      ai: data,
    });
  } catch (error) {
    ragRequestsTotal.inc({ operation: "summary", status: "error" });
    throw error;
  }
});
/**
 * الدكتور يسأل سؤال عن المريض
 * POST /api/medical-ai/ask
 * Body: { userId, question, chatHistory? }
 */

export const askQuestion = catchAsync(async (req, res) => {
  const { userId, question, chatHistory } = req.body;

  if (!userId) throw new ApiError("userId is required", 400);
  if (!question) throw new ApiError("question is required", 400);
  if (question.trim().length < 3) {
    throw new ApiError("The question is short", 400);
  }
  const start = Date.now();
  try {
    const answer = await askAboutPatient(userId, question, chatHistory || []);
    ragRequestsTotal.inc({ operation: "ask", status: "success" });
    ragResponseDurationMs.observe({ operation: "ask" }, Date.now() - start);
    successResponse(res, "Question answered successfully.", {
      answer,
      question,
    });
  } catch (error) {
    ragRequestsTotal.inc({ operation: "ask", status: "error" });
    throw error;
  }
});

/**
 * عند إضافة تقرير جديد → نضيفه للـ vector DB فوراً
 * POST /api/medical-ai/index-report
 * Body: { report }
 */
export const indexNewReport = catchAsync(async (req, res) => {
  const { report } = req.body;
  if (!report) throw new ApiError("بيانات التقرير مطلوبة", 400);

  const count = await indexReport(report);
  successResponse(
    res,
    `Successfully added ${count} chunks to the medical vector store.`,
    { count },
  );
});
