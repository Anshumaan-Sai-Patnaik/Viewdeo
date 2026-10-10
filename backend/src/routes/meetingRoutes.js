import express from "express";

import { createMeeting, startMeeting, endMeeting, joinMeeting, getParticipants } from "../controllers/meetingControllers.js";

const router = express.Router();

router.post("/create", createMeeting);
router.post("/start", startMeeting);
router.post("/end", endMeeting);

router.post("/join", joinMeeting);
router.get("/:meetingCode/participants", getParticipants);

export default router;
