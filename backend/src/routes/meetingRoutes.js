import express from "express";

import { createMeeting, joinMeeting } from "../controllers/meetingControllers.js";

const router = express.Router();

router.post("/create", createMeeting);
router.post("/join", joinMeeting);

export default router;
