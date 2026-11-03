import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";

const jwks = createRemoteJWKSet(
  new URL("/api/auth/jwks", env.CORS_ORIGIN),
);

export async function validateToken(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = request.get("authorization");
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!token) {
    response.status(401).json({ message: "A bearer token is required" });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, jwks);
    const userEmail = payload.email;

    if (typeof userEmail !== "string" || !userEmail.trim()) {
      response.status(401).json({ message: "Token does not contain a user email" });
      return;
    }

    request.userEmail = userEmail.trim().toLowerCase();
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
}
