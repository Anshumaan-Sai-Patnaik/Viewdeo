import express from "express";

import { getUser, makeUser, runUser } from "../controllers/userControllers.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", makeUser);
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message || "Incorrect email or password." });
    }
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
      }
      return runUser(req, res);
    });
  })(req, res, next);
});

router.get("/me", getUser);

export default router;
