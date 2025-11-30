import type { Request, Response, NextFunction } from "express";
import { ACCESS_KEY, ECODE_403, EMESSAGE_403 } from "../constants.js";
import { verifyToken } from "../services/jwt.js";

async function protectedRoute(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("KEY", req.headers[ACCESS_KEY]);
    await verifyToken(req.headers[ACCESS_KEY] as string);
    next();
  } catch (error) {
    console.log(error);
    return res.status(ECODE_403).json({ error: EMESSAGE_403 });
  }
}

function isLoggedIn(req: Request) {}

export { protectedRoute, isLoggedIn };
