import type { Request } from "express";

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: User;
}
