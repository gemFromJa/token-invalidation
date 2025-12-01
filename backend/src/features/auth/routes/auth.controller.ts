import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { User } from "../types.js";
import { ValidationError } from "@/common/errors.js";
import {
  ACCESS_KEY,
  ECODE_403,
  EMESSAGE_403,
  REFRESH_KEY,
} from "../constants.js";
import { login, logoutAllDevices, signup } from "../services/auth.js";
import {
  generateAccessToken,
  generateTokens,
  verifyRefresh,
} from "../services/jwt.js";
import { getUserById } from "../db/user.js";
import { invalidateRefreshToken, saveRefreshToken } from "../db/token.js";
import { fa } from "zod/locales";

const router = express.Router();

router.post(
  "/signup",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as User;
      await signup(body.username, body.password, "user");
      return res.status(200).json({ success: true });
    } catch (err) {
      let message = "Unknown error";
      let statusCode = 500;

      if (err instanceof ValidationError) {
        message = err.message;
        statusCode = err.statusCode;
      }

      res.status(statusCode).json({ success: false, error: message });
    }
  }
);

function getDomain(url: string) {
  const parsedUrl = new URL((url.startsWith("http") ? "" : "https://") + url);

  return parsedUrl.hostname;
}

/* Login to Application and get tokens */
router.post(
  "/login",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as User;
      const user = await login(body.username, body.password);

      const { accessToken, refreshToken } = await generateTokens(user);

      //  Add refresh token to db
      const in7Days = new Date();
      in7Days.setDate(in7Days.getDate() + 7);
      await saveRefreshToken(refreshToken, in7Days, user.id);

      // save refresh token in cookie
      res.cookie(REFRESH_KEY, refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Use secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // sameSite: "lax",
        domain: getDomain(process.env.VERCEL_URL || ""),
        sameSite: "none",
        secure: true,
      });
      res.cookie(ACCESS_KEY, accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Use secure in production
        maxAge: 1 * 60 * 1000, // 10 mins in milliseconds
        // sameSite: "lax",
        domain: getDomain(process.env.VERCEL_URL || ""),
        sameSite: "none",
        secure: true,
      });

      //  TODO: save refresh token to file

      return res.status(200).json({
        success: true,
        data: { username: user.username, id: user.id, role: user.role },
        accessToken,
      });
    } catch (err) {
      console.log(err);
      let message = "Unknown error";
      let statusCode = 500;

      if (err instanceof ValidationError) {
        message = err.message;
        statusCode = err.statusCode;
      }

      res.status(statusCode).json({ success: false, error: message });
    }
  }
);

// refresh refresh token
//    invalidate old token
// @returns Auth + new Refresh token
router.get(
  "/refresh",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (await verifyRefresh(req.cookies[REFRESH_KEY])) as {
        id: string;
      };

      const user = await getUserById(Number(id));

      if (!user) throw new ValidationError(EMESSAGE_403, ECODE_403);

      const { accessToken, refreshToken } = await generateTokens(user);

      // TODO: invalidate old refresh token
      await invalidateRefreshToken(req.cookies[REFRESH_KEY]);

      // TODO: add new refresh token
      const in7Days = new Date();
      in7Days.setDate(in7Days.getDate() + 7);
      await saveRefreshToken(refreshToken, in7Days, user.id);

      res.cookie(REFRESH_KEY, refreshToken, {
        httpOnly: true,
        // sameSite: "lax",
        secure: true,
        domain: getDomain(process.env.VERCEL_URL || ""),
        sameSite: "none",
        // secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie(ACCESS_KEY, accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Use secure in production
        maxAge: 10 * 60 * 1000, // 7 days in milliseconds
        // sameSite: "lax",
        domain: getDomain(process.env.VERCEL_URL || ""),
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({
        accessToken,
      });
    } catch (err) {
      let message = "Unknown error";
      let statusCode = 500;

      console.log(err);

      if (err instanceof ValidationError) {
        message = err.message;
        statusCode = err.statusCode;
      }

      res.status(statusCode).json({ success: false, error: message });
    }
  }
);

// Get a new token as long as auth refresh valid
router.get(
  "/token",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (await verifyRefresh(await req.cookies[REFRESH_KEY])) as {
        id: string;
      };

      // this expensive. Can we use old payload ignoring it being logged out?
      const user = await getUserById(Number(id));

      if (!user) throw new ValidationError(EMESSAGE_403, ECODE_403);

      const accessToken = await generateAccessToken(user);

      res.cookie(ACCESS_KEY, accessToken, {
        // secure: process.env.NODE_ENV === "production", // Use secure in production
        maxAge: 10 * 60 * 1000, // 7 days in milliseconds
        // sameSite: "lax",
        domain: "localhost",
        sameSite: "none",
        secure: true,
      });

      // TODO: invalidate access token

      return res.status(200).json({
        accessToken,
      });
    } catch (err) {
      let message = "Unknown error";
      let statusCode = 500;

      if (err instanceof ValidationError) {
        message = err.message;
        statusCode = err.statusCode;
      }

      res.status(statusCode).json({ success: false, error: message });
    }
  }
);

// Invalidate logout token + refresh token
router.get("/logout", async function (req: Request, res: Response) {
  try {
    await invalidateRefreshToken(req.cookies[REFRESH_KEY]);

    res.clearCookie(REFRESH_KEY);
    res.clearCookie(ACCESS_KEY);

    // TODO: Invalidate accesskey in memory ( last only 15 mins) better than a network req.
    res.json({
      success: true,
    });
  } catch (err) {
    let message = "Unknown error";
    let statusCode = 500;

    if (err instanceof ValidationError) {
      message = err.message;
      statusCode = err.statusCode;
    }

    res.status(statusCode).json({ success: false, error: message });
  }
});

// invalidate all refresh + auth tokens
router.get(
  "/logout-all",
  async function (req: Request, res: Response, next: NextFunction) {
    /**
     * TODO: 1. increment key version
     * 2. add check for key_version
     **/

    try {
      const payload = await verifyRefresh(req.cookies[REFRESH_KEY]);

      if (payload.id) {
        await logoutAllDevices(payload.id);
      }

      res.json({
        success: true,
      });
    } catch (err) {
      let message = "Unknown error";
      let statusCode = 500;

      if (err instanceof ValidationError) {
        message = err.message;
        statusCode = err.statusCode;
      }

      res.status(statusCode).json({ success: false, error: message });
    }
  }
);

export default router;
