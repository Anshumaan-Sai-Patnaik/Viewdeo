import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.VITE_PUBLIC_URL|| "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

export { app };
