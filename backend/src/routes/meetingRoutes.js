import express from "express";

import { createMeeting, startMeeting, joinMeeting } from "../controllers/meetingControllers.js";

const router = express.Router();

router.post("/create", createMeeting);
router.post("/start", startMeeting);
router.post("/join", joinMeeting);

export default router;
