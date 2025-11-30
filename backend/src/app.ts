import dotenv from "dotenv";
dotenv.config({ path: [".env", ".env.local"] });

//  MISC
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";

// ROUTES
import authRouter from "@/features/auth/routes.js";
import dashboardRouter from "@/features/dashboard/routes.js";

// TYPES
import type { Response, Request, NextFunction } from "express";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Register routes
app.use("/auth", authRouter.authController);
app.use("/dashboard", dashboardRouter.dashboardController);

// Catch 404 and forward to error handler
app.use(function (_, __, next: NextFunction) {
  next(createError(404));
});

// Error handler
app.use(function (err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({ error: err.message });
});

export default app;
