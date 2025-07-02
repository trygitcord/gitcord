import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const GET = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      // Check authentication
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Get query parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const filter = searchParams.get("filter"); // 'all', 'read', 'unread'

      // Validate pagination parameters
      const validPage = Math.max(1, page);
      const validLimit = Math.min(Math.max(1, limit), 50); // Max 50 items per page

      // Build query
      const query: { recipient: string; isRead?: boolean } = {
        recipient: session.user.id,
      };

      if (filter === "read") {
        query.isRead = true;
      } else if (filter === "unread") {
        query.isRead = false;
      }

      // Get total count for pagination
      const totalCount = await models.Message.countDocuments(query);

      // Calculate pagination
      const skip = (validPage - 1) * validLimit;
      const totalPages = Math.ceil(totalCount / validLimit);

      // Get messages
      const messages = await models.Message.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(validLimit)
        .lean();

      // Get unread count
      const unreadCount = await models.Message.countDocuments({
        recipient: session.user.id,
        isRead: false,
      });

      return NextResponse.json({
        success: true,
        data: {
          messages: messages.map((msg) => ({
            id: msg._id,
            sender: msg.sender,
            subject: msg.subject,
            content: msg.content,
            isRead: msg.isRead,
            readAt: msg.readAt,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
          })),
          pagination: {
            currentPage: validPage,
            totalPages,
            totalCount,
            limit: validLimit,
            hasNext: validPage < totalPages,
            hasPrev: validPage > 1,
          },
          unreadCount,
        },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
