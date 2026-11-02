import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import eventRouter from "./routes/event.routes.js";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/v1/events", eventRouter);
