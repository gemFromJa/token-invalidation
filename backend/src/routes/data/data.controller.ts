import express from "express";
import type { Request, Response, NextFunction } from "express";

const router = express();

router.get("/", function name(req: Request, res: Response, next: NextFunction) {
  return res.json({ data: [] });
});
