import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If not logged in → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Restrict admin routes
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }

    // Restrict user routes for admins (optional)
    if (pathname.startsWith("/user") && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // protect both areas
};
