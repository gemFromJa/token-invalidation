import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unprotectedRoutes } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const pathname = request.nextUrl.pathname;

  if (
    (!refreshToken || refreshToken === "") &&
    !unprotectedRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (pathname === "/login" && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
