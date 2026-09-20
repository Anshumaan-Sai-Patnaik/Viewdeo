import express from "express";

import { createMeeting, startMeeting, joinMeeting, endMeeting } from "../controllers/meetingControllers.js";

const router = express.Router();

router.post("/create", createMeeting);
router.post("/start", startMeeting);
router.post("/end", endMeeting);

router.post("/join", joinMeeting);

export default router;
