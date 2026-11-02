import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/events.controller.js";

const eventRouter = Router();

eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/", createEvent);
eventRouter.patch("/:id", updateEvent);
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
