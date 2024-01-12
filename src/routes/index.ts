import { Router } from "express";

import schedulerRoutes from "./scheduler.routes";

const router = Router();

router.use("/scheduler", schedulerRoutes);

export default router;
