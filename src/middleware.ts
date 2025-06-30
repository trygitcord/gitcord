import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token?: any } }) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth?.token;

    // Check if trying to access moderator page
    if (pathname.startsWith("/feed/moderator")) {
      // If user is not a moderator, redirect to dashboard
      if (!token?.isModerator) {
        return NextResponse.redirect(new URL("/feed/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/feed/:path*"],
};
