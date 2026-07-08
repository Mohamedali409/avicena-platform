import { Router } from "express";
import { doctorGuard } from "../../shared/guards/doctor.guard.js";
import {
  getPatientSummary,
  askQuestion,
  indexNewReport,
} from "./medical-ai.controller.js";

const router = Router();

// كل الـ endpoints دي للدكتور بس
router.use(doctorGuard);

// ملخص تلقائي عند فتح محادثة مع مريض
router.get("/summary/:userId", getPatientSummary);

// الدكتور يسأل سؤال
router.post("/ask", askQuestion);

// إضافة تقرير جديد للـ vector DB
router.post("/index-report", indexNewReport);

export default router;
