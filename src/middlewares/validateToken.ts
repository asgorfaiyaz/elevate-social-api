import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";

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
    const jwks = createRemoteJWKSet(
      new URL(`${env.CORS_ORIGIN}/api/auth/jwks`),
    );
    const { payload } = await jwtVerify(token, jwks);
    console.log(payload);
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
}
