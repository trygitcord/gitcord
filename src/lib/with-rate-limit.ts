import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RateLimiter, getClientIdentifier, rateLimiters } from "./rate-limiter";
import { withDb, type DbModels } from "./withDb";

interface RateLimitOptions {
  rateLimiter: RateLimiter;
  useUserIdentifier?: boolean; // If true, use user ID instead of IP
  onRateLimitExceeded?: (req: NextRequest, info: RateLimitInfo) => NextResponse;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

type ApiHandler = (
  request: NextRequest,
  context: unknown,
  rateLimitInfo?: RateLimitInfo
) => Promise<NextResponse>;

export function withRateLimit(handler: ApiHandler, options: RateLimitOptions) {
  return async (request: NextRequest, context: unknown) => {
    try {
      let identifier: string;

      if (options.useUserIdentifier) {
        // Use user-based rate limiting
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          // If no user session, fall back to IP-based rate limiting
          identifier = getClientIdentifier(request);
        } else {
          identifier = getClientIdentifier(request, session.user.id);
        }
      } else {
        // Use IP-based rate limiting
        identifier = getClientIdentifier(request);
      }

      const result = await options.rateLimiter.check(identifier);

      // Add rate limit headers to response
      const headers = {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
      };

      if (!result.success) {
        const rateLimitInfo: RateLimitInfo = {
          limit: result.limit,
          remaining: result.remaining,
          resetTime: result.resetTime,
          retryAfter: result.retryAfter!,
        };

        // Use custom handler if provided
        if (options.onRateLimitExceeded) {
          return options.onRateLimitExceeded(request, rateLimitInfo);
        }

        // Default rate limit exceeded response
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: `Too many requests. Try again in ${result.retryAfter} seconds.`,
            retryAfter: result.retryAfter,
          },
          {
            status: 429,
            headers: {
              ...headers,
              "Retry-After": result.retryAfter!.toString(),
            },
          }
        );
      }

      // Call the original handler
      const response = await handler(request, context, {
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.resetTime,
        retryAfter: 0,
      });

      // Add rate limit headers to successful response
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error("Rate limiting error:", error);
      // If rate limiting fails, continue with the original handler
      return handler(request, context);
    }
  };
}

// Convenience function for combining with existing withDb wrapper
export function withRateLimitAndDb(
  handler: (
    request: NextRequest,
    context: unknown,
    models: DbModels,
    rateLimitInfo?: RateLimitInfo
  ) => Promise<NextResponse>,
  rateLimitOptions: RateLimitOptions
) {
  return withRateLimit(withDb(handler), rateLimitOptions);
}

// Common rate limit configurations
export const rateLimitConfigs = {
  // For general API endpoints
  general: {
    rateLimiter: rateLimiters.general,
    useUserIdentifier: false,
  },

  // For authentication endpoints
  auth: {
    rateLimiter: rateLimiters.auth,
    useUserIdentifier: false,
  },

  // For messaging endpoints
  messaging: {
    rateLimiter: rateLimiters.messaging,
    useUserIdentifier: true,
  },

  // For profile access
  profile: {
    rateLimiter: rateLimiters.profile,
    useUserIdentifier: true,
  },

  // For sensitive operations
  strict: {
    rateLimiter: rateLimiters.strict,
    useUserIdentifier: true,
  },
};
