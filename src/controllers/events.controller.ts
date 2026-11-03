import { ObjectId, type Document } from "mongodb";
import type { Request, Response } from "express";
import { db } from "../db/mongodb.js";

const events = db.collection("events");
const joinedEvents = db.collection<{
  userEmail: string;
  eventId: ObjectId;
}>("joinedEvents");

function parseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function parseEventId(id: string): ObjectId | null {
  // MongoDB stores document IDs as ObjectId values, but Express gives you the route parameter as a string.
  // Parsing the ID converts that string into an ObjectId so the controller can query MongoDB by _id.
  return /^[\da-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

async function isUserJoined(userEmail: string, eventId: ObjectId) {
  const membership = await joinedEvents.findOne({ userEmail, eventId });
  return membership !== null;
}

export async function getEvents(request: Request, response: Response) {
  const { title, eventType } = request.query;
  const filter: Document = {};
  if (eventType) filter.eventType = eventType;
  if (title) {
    const escapedTitle = (title as string).replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    filter.title = { $regex: escapedTitle, $options: "i" };
  }

  const data = await events.find(filter).toArray();
  response.status(200).json({
    success: true,
    data: {
      events: data,
    },
  });
}

export async function getMyEvents(request: Request, response: Response) {
  const userEmail = request.userEmail;
  if (!userEmail) {
    return response.status(401).json({ message: "Authentication required" });
  }

  const data = await events.find({ createdByEmail: userEmail }).toArray();
  response.status(200).json({
    success: true,
    data: {
      events: data,
    },
  });
}

export async function getEventById(request: Request, response: Response) {
  const id = parseEventId(request.params.id);
  if (!id) return response.status(400).json({ message: "Invalid event id" });

  const event = await events.findOne({ _id: id });
  if (!event) return response.status(404).json({ message: "Event not found" });

  response.status(200).json({
    success: true,
    data: {
      event,
    },
  });
}

export async function getEventJoinStatus(request: Request, response: Response) {
  const eventId = parseEventId(request.params.id);
  if (!eventId) return response.status(400).json({ message: "Invalid event id" });

  const userEmail = request.userEmail;
  if (!userEmail) {
    return response.status(401).json({ message: "Authentication required" });
  }

  const eventExists = await events.findOne(
    { _id: eventId },
    { projection: { _id: 1 } },
  );
  if (!eventExists) return response.status(404).json({ message: "Event not found" });

  const isJoined = await isUserJoined(userEmail, eventId);
  response.status(200).json({
    success: true,
    data: { isJoined },
  });
}

export async function joinEvent(request: Request, response: Response) {
  const eventId = parseEventId(request.params.id);
  if (!eventId)
    return response.status(400).json({ message: "Invalid event id" });

  const userEmail = request.userEmail;
  if (!userEmail) {
    return response
      .status(400)
      .json({ message: "A valid userEmail is required" });
  }

  const event = await events.findOne({ _id: eventId });
  if (!event) return response.status(404).json({ message: "Event not found" });

  await joinedEvents.insertOne({
    userEmail,
    eventId,
  });

  response.status(201).send();
}

export async function getJoinedEvents(request: Request, response: Response) {
  const userEmail = request.userEmail;
  if (!userEmail) {
    return response
      .status(400)
      .json({ message: "A valid userEmail is required" });
  }

  const res = await joinedEvents.find({ userEmail }).toArray();
  const eventIds = res.map((e) => e.eventId);
  const data = eventIds.length
    ? await events.find({ _id: { $in: eventIds } }).toArray()
    : [];

  response.status(200).json({
    success: true,
    data: { events: data },
  });
}

export async function createEvent(request: Request, response: Response) {
  const event = request.body;
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return response
      .status(400)
      .json({ message: "Request body must be an object" });
  }

  const result = await events.insertOne(event as Document);
  response.status(201).json({ ...event, _id: result.insertedId });
}

export async function updateEvent(request: Request, response: Response) {
  const id = parseEventId(request.params.id);
  if (!id) return response.status(400).json({ message: "Invalid event id" });

  const updates = request.body as Document;
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return response
      .status(400)
      .json({ message: "Request body must be an object" });
  }
  delete updates._id;

  const result = await events.findOneAndUpdate(
    { _id: id },
    { $set: updates },
    { returnDocument: "after" },
  );
  if (!result) return response.status(404).json({ message: "Event not found" });

  response.json(result);
}

export async function deleteEvent(request: Request, response: Response) {
  const id = parseEventId(request.params.id);
  if (!id) return response.status(400).json({ message: "Invalid event id" });

  const result = await events.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return response.status(404).json({ message: "Event not found" });
  }

  response.status(204).send();
}
