import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import type { User } from "../types.js";
import { createInterface } from "readline/promises";
import { ValidationError } from "@/common/errors.js";

// 1. Get the absolute path to this file (using fileURLToPath)
const __filename = fileURLToPath(import.meta.url);

// 2. Get the directory name from the file path (equivalent to old __dirname)
const __dirname = path.dirname(__filename);

const getLockfileName = (filename: string) => filename + ".lock";

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
  await appendUser(username, password);
}

async function appendUser(username: string, password: string) {
  const filename = path.join(__dirname, "auth.txt");
  try {
    await flock(filename);
    fs.appendFile(filename, `${username},${password}\n`);
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
