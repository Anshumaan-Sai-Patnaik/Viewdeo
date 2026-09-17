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

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    const publicUrl = process.env.VITE_PUBLIC_URL || "http://localhost:5173";
    const protectedUrl = process.env.VITE_PROTECTED_URL || "http://localhost:5174";

    if (err) {
      console.error(err);
      return res.redirect(`${publicUrl}?error=server_error`);
    }
    
    if (!user) {
      // e.g. email already exists
      // Passing the message to the frontend via URL query parameters.
      const errorMsg = info?.message ? encodeURIComponent(info.message) : "authentication_failed";
      return res.redirect(`${publicUrl}?error=${errorMsg}`);
    }

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect(`${publicUrl}?error=login_failed`);
      }
      // Success! Redirect to Protected App.
      return res.redirect(protectedUrl);
    });
  })(req, res, next);
});

router.get("/me", getUser);

export default router;
