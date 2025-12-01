import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import type { User } from "../types.js";
import { ValidationError } from "@/common/errors.js";
import { addUser, getUserByUsername } from "../db/user.js";
import {
  invalidateAllUserTokens,
  invalidateRefreshToken,
} from "../db/token.js";

// 1. Get the absolute path to this file (using fileURLToPath)
const __filename = fileURLToPath(import.meta.url);

// 2. Get the directory name from the file path (equivalent to old __dirname)
const __dirname = path.dirname(__filename);

export async function login(username: string, password: string) {
  const user = await getUserByUsername(username);

  if (!user) throw new ValidationError("Please recheck your credentials!", 401);

  const isCorrectPassword = await verifyPassword(user, password);

  if (isCorrectPassword) return user;

  throw new ValidationError("Please recheck your credentials!", 401);
}

async function verifyPassword(user: User, password: string) {
  return await bcrypt.compare(password, user.password);
}

export async function signup(username: string, password: string, role: string) {
  try {
    await addUser(username, await hashPassword(password), role);
  } catch (e) {
    console.log(e);

    throw new ValidationError("Unable to signup", 400);
  }
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Clear from db, ivalidated it essentially
export async function logout(token: string) {
  return await invalidateRefreshToken(token);
}

//  Logout all devices for user
export async function logoutAllDevices(id: string) {
  //  TODO: update cache as well
  return await invalidateAllUserTokens(id);
}
