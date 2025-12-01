import type { NextFunction, Response, Request } from "express";
import { z } from "zod";

const sortingFields = [
  "first_name",
  "last_name",
  "average_ratings",
  "calls",
] as const;

const urlSchema = z.object({
  searchTerm: z.string().optional(),
  limit: z.number().min(10),
  offset: z.number().min(0).optional(),
  orderBy: z.enum(sortingFields).optional(),
  direction: z.enum(["DESC", "ASC", "asc", "desc"]).optional(),
});

export async function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = Number(req.query.limit);
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    urlSchema.parse({ ...req.query, limit, offset });

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: "Malformed Parameters" });
  }
}
