import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/auth/sign-up",
  "/auth/sign-in",
  "/not-allowed",
  "/auth/reset-password",
  "/auth/forgot-password",
  "/products",
  "/",
];

export default auth((req) => {
  const token = req.auth;
  const { pathname, origin } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = pathname.startsWith("/auth/");

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/products", origin));
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/not-allowed", origin));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/products", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|products|favicon.ico|images|icons|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.gif|.*\\.ico).*)",
  ],
};
