import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { readJsonFile } from "./dashboard.services.js";
import { protectedRoute } from "../auth/auth.middleware.js";
const router = express.Router();

/* GET dashboard page. */
router.get("/", protectedRoute, async function (_, res: Response) {
  try {
    const data = (await readJsonFile()) || [];

    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to load data!",
    });
  }
});

export default router;
