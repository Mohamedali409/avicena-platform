import { Router } from "express";
import * as videoController from "./video.controller.js";
import { doctorGuard } from "../../shared/guards/doctor.guard.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

const anyAuth = (req, res, next) => {
  if (req.headers.dtoken || req.cookies?.dtoken)
    return doctorGuard(req, res, next);

  return authGuard(req, res, next);
};

router.use(anyAuth);

router.get("/history", videoController.getCallHistory);
router.get("/:id", videoController.getCallById);

export default router;
