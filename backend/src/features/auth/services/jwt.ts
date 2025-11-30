import path from "path";
import { fileURLToPath } from "url";
import type { User } from "../types.js";
import { ValidationError } from "@/common/errors.js";
import jwt from "jsonwebtoken";
import { ECODE_403, EMESSAGE_403 } from "../constants.js";
import { getCacheRefreshToken } from "../db/token.js";

// 1. Get the absolute path to this file (using fileURLToPath)
const __filename = fileURLToPath(import.meta.url);

// 2. Get the directory name from the file path (equivalent to old __dirname)
const __dirname = path.dirname(__filename);

export async function generateTokens(user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
}

export function generateAccessToken(user: User) {
  const payload = { sub: user.id, role: user.role };
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new ValidationError("Unable to complete action");

  const token = jwt.sign(payload, secret, {
    expiresIn: "10m",
  });

  return token;
}

function generateRefreshToken(user: User) {
  const payload = { id: user.id };
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) throw new ValidationError("Unable to complete action");

  const token = jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });

  return token;
}

export async function getTokenPayload(token: string) {
  //
  return jwt.decode(token);
}

// Verify access token is valid
export async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new ValidationError("Unable to complete action");

  try {
    const payload = jwt.verify(token, secret);

    return payload;
  } catch (error) {
    throw new ValidationError(EMESSAGE_403, ECODE_403);
  }
}

// Verify refresh token is valid
export async function verifyRefresh(token: string) {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) throw new ValidationError("Unable to complete action");

  try {
    const payload = jwt.verify(token, secret);

    // check if in db and is valid
    const refreshToken = await getCacheRefreshToken(token);

    if (!refreshToken || refreshToken.status !== "valid") {
      throw new ValidationError("Not logged in", 401);
    }

    return payload;
  } catch (error) {
    throw new ValidationError(EMESSAGE_403, ECODE_403);
  }
}
