import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import './config/passport.js';

const app = express();

app.use(cors({
  origin: [ process.env.VITE_PUBLIC_URL|| "http://localhost:5173", process.env.VITE_PROTECTED_URL|| "http://localhost:5174" ],
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

export { app };
