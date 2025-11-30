import express, { type Response } from "express";
import { readJsonFile } from "../services/data.js";
import { protectedRoute } from "@/features/auth/middleware/auth.js";
const router = express.Router();

/* GET dashboard page. */
router.get("/", protectedRoute, async function (_, res: Response) {
  try {
    // TODO: add data to db and implement pagination
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
