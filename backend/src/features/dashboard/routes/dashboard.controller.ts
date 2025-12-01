import express from "express";
import type { Response, Request } from "express";
import { getDashboardData } from "../services/data.js";
import { protectedRoute } from "@/features/auth/middleware/auth.js";
import { validate } from "../middleware/validate.js";
import type { SearchQuery } from "../types.js";
const router = express.Router();

/* GET dashboard page. */
router.get(
  "/",
  protectedRoute,
  validate,
  async function (req: Request & { query: SearchQuery }, res: Response) {
    try {
      // TODO: add data to db and implement pagination
      const params = {
        searchTerm: req.query.searchTerm,
        offset: Number(req.query.startRow),
        limit: Number(req.query.count ?? 10),
        orderBy: req.query.orderBy,
        direction: req.query.direction ?? "DESC",
      };
      const data = await getDashboardData(params);

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Unable to load data!",
        success: false,
      });
    }
  }
);

export default router;
