import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  findUser,
  findUserAndVerify,
  generateAccessToken,
  generateTokens,
  verifyRefresh,
  verifyToken,
  writeNewUser,
} from "./auth.services.js";
import type { User } from "./types.js";
import { ValidationError } from "./errors.js";
import { ECODE_403, EMESSAGE_403 } from "./constants.js";
const router = express.Router();

const REFRESH_KEY = "refresh_token";

router.post(
  "/signup",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as User;
      await writeNewUser(body.username, body.password);
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
/* GET home page. */
router.post(
  "/login",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as User;
      const user = await findUserAndVerify(body.username, body.password);

      const { accessToken, refreshToken } = await generateTokens(user);

      // generate refresh token & auth token
      res.cookie(REFRESH_KEY, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: "lax",
      });

      //  TODO: save refresh token to file

      return res.status(200).json({
        success: true,
        data: { username: user.username },
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
      const { username } = (await verifyRefresh(req.cookies[REFRESH_KEY])) as {
        username: string;
      };

      console.log("FROM VERIFY", username);
      const user = await findUser(username);

      if (!user) throw new ValidationError(EMESSAGE_403, ECODE_403);

      const { accessToken, refreshToken } = await generateTokens(user);

      // TODO: invalidate access and refresh token
      res.cookie(REFRESH_KEY, refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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

// Get a new token as long as auth refresh valid
router.get(
  "/token",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (await verifyRefresh(req.cookies[REFRESH_KEY])) as {
        username: string;
      };

      console.log("FROM VERIFY", username);
      const user = await findUser(username);

      if (!user) throw new ValidationError(EMESSAGE_403, ECODE_403);

      // const claim = (await verifyToken(
      //   req.headers.access_token as string
      // )) as User;

      const accessToken = await generateAccessToken(user);

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
router.get(
  "/logout",
  function (req: Request, res: Response, next: NextFunction) {
    res.json({
      data: [{ names: [] }],
    });
  }
);

// invalidate all refresh + auth tokens
router.get(
  "/logout-all",
  function (req: Request, res: Response, next: NextFunction) {
    res.json({
      data: [{ names: [] }],
    });
  }
);

export default router;
