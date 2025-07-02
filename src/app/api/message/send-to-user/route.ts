import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const POST = withDb(
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

      // Parse request body
      const body = await request.json();
      const { recipientId, subject, content } = body;

      // Validate input
      if (!recipientId || !subject || !content) {
        return NextResponse.json(
          { error: "Missing required fields: recipientId, subject, content" },
          { status: 400 }
        );
      }

      // Check if recipient exists
      const recipient = await models.User.findById(recipientId);

      if (!recipient) {
        return NextResponse.json(
          { error: "Recipient not found" },
          { status: 404 }
        );
      }

      // Create message
      const message = await models.Message.create({
        recipient: recipientId,
        sender: "Gitcord",
        subject,
        content,
        isRead: false,
      });

      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
        data: {
          id: message._id,
          recipient: message.recipient,
          subject: message.subject,
          createdAt: message.createdAt,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
