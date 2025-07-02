import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
  email: string;
  avatar_url: string | null;
  isModerator: boolean;
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
      // Check authentication
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is moderator
      const currentUser = await models.User.findById(session.user.id);

      if (!currentUser || !currentUser.isModerator) {
        return NextResponse.json(
          { error: "Forbidden: Moderator access required" },
          { status: 403 }
        );
      }

      // Get query parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search") || "";
      const includeAll = searchParams.get("includeAll") === "true"; // For "send to all" option

      // Validate pagination parameters
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
        .select("_id name username email avatar_url isModerator")
        .sort({ username: 1 }) // Sort alphabetically by username
        .skip(skip)
        .limit(validLimit)
        .lean();

      response.data.users = users.map(
        (user): UserResponse => ({
          id: String(user._id),
          name: String(user.name),
          username: String(user.username),
          email: String(user.email),
          avatar_url: user.avatar_url ? String(user.avatar_url) : null,
          isModerator: Boolean(user.isModerator),
        })
      );

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
