import express from "express";

import { createMeeting } from "../controllers/meetingControllers.js";

const router = express.Router();

router.post("/create", createMeeting);

export default router;
