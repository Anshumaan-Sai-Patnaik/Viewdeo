import express from "express";

import { makeUser, runUser } from "../controllers/userControllers.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", makeUser);
router.post("/login", passport.authenticate("local"), runUser);

export default router;
