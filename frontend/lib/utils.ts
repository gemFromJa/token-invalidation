import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unprotectedRoutes } from "./constants";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function refreshToken() {}

interface TokensProps {
  refresh_token: string;
  access_token: string;
}

interface RedirectProps {
  login: string;
  home: string;
}

export function validateRoute(
  pathname: string,
  { refresh_token }: TokensProps,
  { login, home }: RedirectProps
) {
  const urlFilter = new RegExp(
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  );

  const isPageOrApiRoute = urlFilter.test(pathname);
  const isSoftLoggedIn = !refresh_token || refresh_token === "";

  if (isPageOrApiRoute && isSoftLoggedIn) {
    if (!unprotectedRoutes.includes(pathname)) {
      redirect(login);
    }
  } else if (pathname === login || pathname === "/") {
    redirect(home);
  }
}
