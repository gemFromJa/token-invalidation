import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import type { User } from "./types.js";
import { createInterface } from "readline/promises";
import { ValidationError } from "./errors.js";
import jwt from "jsonwebtoken";
import { ECODE_403, EMESSAGE_403 } from "./constants.js";

// 1. Get the absolute path to this file (using fileURLToPath)
const __filename = fileURLToPath(import.meta.url);

// 2. Get the directory name from the file path (equivalent to old __dirname)
const __dirname = path.dirname(__filename);

// Source - https://stackoverflow.com/a
// Posted by Simon Rigét, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-27, License - CC BY-SA 4.0

const getLockfileName = (filename: string) => filename + ".lock";

// the lock function must be a recursive timer
export const flock = async (file_name: string, timer = 13) => {
  if (timer <= 0) {
    throw new ValidationError("Unable to read file");
  }

  await fs
    .symlink(file_name, getLockfileName(file_name))
    .catch((err: NodeJS.ErrnoException) => {
      if (err)
        if (err.code == "EEXIST") {
          setTimeout(() => {
            flock(file_name, timer - 2);
          }, timer);
        } else {
          console.log(err.code);
          throw new ValidationError("Unable to get file lock!");
        }
    });
};

export const funlock = async (filename: string) => {
  await fs.unlink(getLockfileName(filename)).catch((err) => console.log(err));
};

export async function writeNewUser(username: string, password: string) {
  // verify username doesn't exist
  const user = await findUser(username);

  if (user) {
    throw new ValidationError("User exists", 400);
  } else {
    await appendUser(username, password);
  }
}

async function appendUser(username: string, password: string) {
  const filename = path.join(__dirname, "auth.txt");
  try {
    await flock(filename);
    fs.appendFile(filename, `${username},${await hashPassword(password)}\n`);
  } catch (error) {
    console.log(error);
    throw new ValidationError("Cannot create user user", 400);
  } finally {
    await funlock(filename);
  }
}

export async function findUser(username: string): Promise<User | null> {
  let user = null;
  const stream = createReadStream(path.join(__dirname, "auth.txt"));

  const lineReader = createInterface({ input: stream, crlfDelay: Infinity });

  await new Promise((resolve, reject) => {
    lineReader.on("line", (l) => {
      // check if username matches
      const [user_name, user_password] = l.split(",");
      if (user_name?.trim().toLowerCase() === username.toLowerCase()) {
        user = {
          username,
          password: user_password,
        };
        resolve(user);
        lineReader.close();
      }
    });

    lineReader.on("error", (err) => {
      lineReader.close();
      reject(err);
    });

    lineReader.on("close", () => {
      // This 'close' event fires either when the file ends, OR when rl.close() is called.
      // If the loop finished without finding a match, resolve with null.
      resolve(null);
    });
  });

  return user;
}

export async function findUserAndVerify(username: string, password: string) {
  const user = await findUser(username);

  if (!user) throw new ValidationError("Please recheck your credentials!", 401);

  const isCorrectPassword = await verifyPassword(user, password);

  if (isCorrectPassword) return user;

  throw new ValidationError("Please recheck your credentials!", 401);
}

async function verifyPassword(user: User, password: string) {
  return await bcrypt.compare(password, user.password);
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function readJsonFile() {
  try {
    const data = await fs.readFile(path.join(__dirname, "auth.txt"), "utf8");
    const jsonObject = JSON.parse(data);
    return jsonObject;
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    throw error;
  }
}

export function generateAccessToken(user: User) {
  const payload = { sub: user.username, role: "user" };
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new ValidationError("Unable to complete action");

  const token = jwt.sign(payload, secret, {
    expiresIn: "15m",
  });

  return token;
}

function generateRefreshToken(user: User) {
  const payload = { username: user.username };
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) throw new ValidationError("Unable to complete action");

  const token = jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });

  return token;
}

export async function generateTokens(user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
}

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

export async function verifyRefresh(token: string) {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) throw new ValidationError("Unable to complete action");

  try {
    const payload = jwt.verify(token, secret);

    return payload;
  } catch (error) {
    throw new ValidationError(EMESSAGE_403, ECODE_403);
  }
}
