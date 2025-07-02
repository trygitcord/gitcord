import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const PATCH = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      // Check authentication
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Parse request body
      const body = await request.json();
      const { messageId } = body;

      if (!messageId) {
        return NextResponse.json(
          { error: "Message ID is required" },
          { status: 400 }
        );
      }

      // Find and update message
      const message = await models.Message.findOneAndUpdate(
        {
          _id: messageId,
          recipient: session.user.id,
          isRead: false, // Only update if not already read
        },
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          new: true, // Return updated document
        }
      );

      if (!message) {
        return NextResponse.json(
          {
            error:
              "Message not found, already read, or you don't have permission",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Message marked as read",
        data: {
          id: message._id,
          isRead: message.isRead,
          readAt: message.readAt,
        },
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
