import type { Request, Response, NextFunction } from "express";
import { ACCESS_KEY, ECODE_403, EMESSAGE_403 } from "../constants.js";
import { verifyToken } from "../services/jwt.js";
import type { RequestWithUser, User } from "../types.js";
import { ValidationError } from "@/common/errors.js";

async function protectedRoute(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.match(/^Bearer [\w-\.]*$/)) {
      throw new ValidationError("No Bearer token", 401);
    }
    const token = authHeader?.toString().split(" ")[1]; // Bearer
    const user = (await verifyToken(token as string)) as User;

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("Validation Error:", error.message);
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(ECODE_403).json({ error: EMESSAGE_403 });
  }
}

function isLoggedIn(req: Request) {}

export { protectedRoute, isLoggedIn };
