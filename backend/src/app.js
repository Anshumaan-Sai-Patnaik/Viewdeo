import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import './config/passport.js';

const app = express();

app.use(cors({
  origin: process.env.VITE_PUBLIC_URL|| "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

export { app };
