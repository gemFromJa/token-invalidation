export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const unprotectedRoutes = [
  "/login",
  "/signup",
  "/about",
  "/contact",
  "/public",
  "404",
];

export const ACCESS_TOKEN_KEY = "access_token";
export const ACCESS_TOKEN_EXPIRE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
