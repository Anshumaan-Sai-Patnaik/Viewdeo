import express from "express";

import { makeUser } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", makeUser);

export default router;
