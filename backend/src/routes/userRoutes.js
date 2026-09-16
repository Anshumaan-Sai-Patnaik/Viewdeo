import express from "express";

import { getUser, makeUser, runUser } from "../controllers/userControllers.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", makeUser);
router.post("/login", passport.authenticate("local"), runUser);

router.get("/me", getUser);

export default router;
