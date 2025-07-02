import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";

// Rate limiting configuration for different API paths
const API_RATE_LIMITS = {
  "/api/auth": rateLimiters.auth,
  "/api/message": rateLimiters.messaging,
  "/api/user": rateLimiters.profile,
  "/api/code": rateLimiters.strict,
  "/api/leaderboard": rateLimiters.general,
  "/api/version": rateLimiters.general,
  // Default for all other API routes
  default: rateLimiters.general,
};

async function handleApiRateLimit(req: NextRequest, token?: any) {
  const pathname = req.nextUrl.pathname;

  // Determine which rate limiter to use
  let rateLimiter = API_RATE_LIMITS.default;

  for (const [path, limiter] of Object.entries(API_RATE_LIMITS)) {
    if (path !== "default" && pathname.startsWith(path)) {
      rateLimiter = limiter;
      break;
    }
  }

  // Get identifier (user ID if authenticated, otherwise IP)
  const identifier = token?.sub
    ? getClientIdentifier(req, token.sub)
    : getClientIdentifier(req);

  const result = await rateLimiter.check(identifier);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: `Too many requests. Try again in ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
          "Retry-After": result.retryAfter!.toString(),
        },
      }
    );
  }

  // Add rate limit headers to the response
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(result.resetTime).toISOString()
  );

  return response;
}

export default withAuth(
  async function middleware(req: NextRequest & { nextauth?: { token?: any } }) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth?.token;

    // Handle API rate limiting
    if (pathname.startsWith("/api/")) {
      return await handleApiRateLimit(req, token);
    }

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
      authorized: ({ token, req }) => {
        // Allow API routes to pass through for rate limiting
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return true;
        }
        // For other protected routes, require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/feed/:path*", "/api/:path*"],
};
