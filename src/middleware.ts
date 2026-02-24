import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("ptAdmin");
  const pathname = req.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard",
    "/wash",
    "/payment/:path*",
    "/service-history/:path*",
    "/sales-report",
    "/marketing",
    "/crm",
    "/user/:path*",
    "/store/:path*",
    "/setting",
  ],
};
