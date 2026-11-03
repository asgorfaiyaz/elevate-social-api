import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventJoinStatus,
  getJoinedEvents,
  getEvents,
  getMyEvents,
  joinEvent,
  updateEvent,
} from "../controllers/events.controller.js";
import { validateToken } from "../middlewares/validateToken.js";

const eventRouter = Router();

eventRouter.get("/", getEvents);
eventRouter.get("/joined", validateToken, getJoinedEvents);
eventRouter.get("/my", validateToken, getMyEvents);
eventRouter.get("/:id/join-status", validateToken, getEventJoinStatus);
eventRouter.get("/:id", getEventById);
eventRouter.post("/:id/join", validateToken, joinEvent);
eventRouter.post("/", validateToken, createEvent);
eventRouter.patch("/:id", validateToken, updateEvent);
eventRouter.delete("/:id", validateToken, deleteEvent);

export default eventRouter;
