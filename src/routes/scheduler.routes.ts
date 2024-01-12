import { Router } from "express";
import {
  addFcmSchedule,
  cancelFcmSchedule,
} from "../controllers/scheduler.controller";

const router = Router();

router.post("/add-fcm-schedule", addFcmSchedule);
router.post("/cancel-fcm-schedule", cancelFcmSchedule);

export default router;
