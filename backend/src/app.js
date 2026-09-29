import express from "express";
import cors from "cors";
import passport from "passport";

import { sessionMiddleware } from "./config/session.js";

import './config/passport.js';

const app = express();

app.use(cors({
  origin: [ process.env.VITE_PUBLIC_URL|| "http://localhost:5173", process.env.VITE_PROTECTED_URL|| "http://localhost:5174" ],
  credentials: true
}));

app.use(express.json());

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

export { app };
