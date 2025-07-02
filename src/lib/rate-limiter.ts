interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

class MemoryStore {
  private store = new Map<string, RateLimitStore>();

  increment(key: string): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || now > existing.resetTime) {
      // Create new entry or reset expired entry
      const resetTime = now + 60 * 1000; // Default 1 minute window
      this.store.set(key, { count: 1, resetTime });
      return { count: 1, resetTime };
    }

    // Increment existing entry
    existing.count++;
    this.store.set(key, existing);
    return { count: existing.count, resetTime: existing.resetTime };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

const memoryStore = new MemoryStore();

// Clean up expired entries every 5 minutes
setInterval(() => {
  memoryStore.cleanup();
}, 5 * 60 * 1000);

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  async check(identifier: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const { count, resetTime } = memoryStore.increment(identifier);
    const remaining = Math.max(0, this.config.maxRequests - count);
    const success = count <= this.config.maxRequests;

    const result = {
      success,
      limit: this.config.maxRequests,
      remaining,
      resetTime,
    };

    if (!success) {
      return {
        ...result,
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      };
    }

    return result;
  }

  async reset(identifier: string): Promise<void> {
    memoryStore.reset(identifier);
  }
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  // General API rate limiter - 100 requests per minute
  general: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  }),

  // Authentication rate limiter - 5 attempts per minute
  auth: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  }),

  // Message sending rate limiter - 10 messages per minute
  messaging: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  }),

  // Profile access rate limiter - 50 requests per minute
  profile: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50,
  }),

  // Strict rate limiter for sensitive operations - 3 requests per minute
  strict: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,
  }),
};

export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  let ip = "unknown";

  if (forwarded) {
    ip = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp;
  } else if (cfConnectingIp) {
    ip = cfConnectingIp;
  }

  return `ip:${ip}`;
}
