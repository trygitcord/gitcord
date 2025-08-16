import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";

// Define types for better type safety
interface UserQuery {
  $or?: Array<{
    username?: { $regex: string; $options: string };
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

interface UserResponse {
  id: string;
  name: string;
  username: string;
  email: string; // Will be masked server-side
  avatar_url: string | null;
  isModerator: boolean;
}

// Server-side email masking for security
function maskEmailServer(email: string): string {
  if (!email || !email.includes("@")) return "***@***.***";

  const [local, domain] = email.split("@");
  if (local.length <= 2) return "*".repeat(local.length) + "@" + domain;

  return (
    local[0] +
    "*".repeat(Math.max(local.length - 2, 1)) +
    local[local.length - 1] +
    "@" +
    domain
  );
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AllUsersOption {
  id: string;
  name: string;
  username: string;
  avatar_url: null;
  userCount: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    pagination: PaginationInfo;
    allUsersOption?: AllUsersOption;
    users?: UserResponse[];
  };
}

export const GET = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      // Rate limiting check first
      const clientId = getClientIdentifier(request);
      const rateLimitResult = await rateLimiters.profile.check(clientId);

      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: "Too many requests",
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimitResult.limit.toString(),
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
              "X-RateLimit-Reset": new Date(
                rateLimitResult.resetTime
              ).toISOString(),
              "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
            },
          }
        );
      }

      // Check authentication
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Enhanced authorization check with additional security
      const currentUser = (await models.User.findById(session.user.id)
        .select("_id isModerator role")
        .lean()) as { _id: string; isModerator: boolean; role?: string } | null;

      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (!currentUser.isModerator) {
        // Log unauthorized access attempt for security monitoring
        console.warn("SECURITY_ALERT: Unauthorized moderator access attempt", {
          userId: session.user.id,
          userEmail: session.user.email,
          timestamp: new Date().toISOString(),
          ip: getClientIdentifier(request),
          userAgent: request.headers.get("user-agent"),
          endpoint: "/api/message/get-users",
        });
        return NextResponse.json(
          { error: "Forbidden: Moderator access required" },
          { status: 403 }
        );
      }

      // Get query parameters with enhanced validation
      const { searchParams } = new URL(request.url);

      // Input validation and sanitization
      const pageParam = searchParams.get("page");
      const limitParam = searchParams.get("limit");
      const searchParam = searchParams.get("search");
      const includeAllParam = searchParams.get("includeAll");

      // Validate and sanitize page parameter
      const page = pageParam
        ? Math.max(1, Math.min(parseInt(pageParam) || 1, 1000))
        : 1;

      // Validate and sanitize limit parameter
      const limit = limitParam
        ? Math.max(1, Math.min(parseInt(limitParam) || 20, 100))
        : 20;

      // Sanitize search parameter to prevent injection
      const search = searchParam
        ? searchParam.trim().substring(0, 100).replace(/[<>]/g, "")
        : "";

      // Validate boolean parameter
      const includeAll = includeAllParam === "true";

      // Additional security: validate pagination bounds
      const validPage = Math.max(1, page);
      const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

      // Build query for search
      const query: UserQuery = {};

      if (search) {
        query.$or = [
          { username: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Get total count for pagination
      const totalCount = await models.User.countDocuments(query);

      // Calculate pagination
      const skip = (validPage - 1) * validLimit;
      const totalPages = Math.ceil(totalCount / validLimit);

      // Build response structure
      const response: ApiResponse = {
        success: true,
        data: {
          pagination: {
            currentPage: validPage,
            totalPages,
            totalCount,
            limit: validLimit,
            hasNext: validPage < totalPages,
            hasPrev: validPage > 1,
          },
        },
      };

      // Add "All Users" option if requested
      if (includeAll && validPage === 1) {
        response.data.allUsersOption = {
          id: "all",
          name: "All Users",
          username: "all-users",
          avatar_url: null,
          userCount: totalCount,
        };
      }

      // Get users
      const users = await models.User.find(query)
        .select("_id name username email avatar_url isModerator createdAt")
        .sort({ createdAt: -1 }) // Sort by newest first (most recently created)
        .skip(skip)
        .limit(validLimit)
        .lean();

      response.data.users = users.map(
        (user): UserResponse => ({
          id: String(user._id),
          name: String(user.name),
          username: String(user.username),
          email: maskEmailServer(String(user.email)), // Mask email server-side for security
          avatar_url: user.avatar_url ? String(user.avatar_url) : null,
          isModerator: Boolean(user.isModerator),
        })
      );

      return NextResponse.json(response);
    } catch (error) {
      // Get session in catch block since it might not be available
      const sessionForLogging = await getServerSession(authOptions);

      // Secure error handling - don't expose internal details
      console.error("Error fetching users:", {
        error: error instanceof Error ? error.message : String(error),
        userId: sessionForLogging?.user?.id,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Return generic error message to prevent information disclosure
      return NextResponse.json(
        { error: "Internal server error occurred" },
        { status: 500 }
      );
    }
  }
);
