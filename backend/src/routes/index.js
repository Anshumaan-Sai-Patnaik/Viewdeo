import { Router } from "express";

import authRoutes from "./authRoutes.js";
import meetingRoutes from "./meetingRoutes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/meeting", meetingRoutes);

export { routes };
