import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = withDb(
  async (request: NextRequest, context: any, models: DbModels) => {
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
      const { subject, content } = body;

      // Validate input
      if (!subject || !content) {
        return NextResponse.json(
          { error: "Missing required fields: subject, content" },
          { status: 400 }
        );
      }

      // Get all users
      const users = await models.User.find({}, "_id").lean();

      if (users.length === 0) {
        return NextResponse.json({ error: "No users found" }, { status: 404 });
      }

      // Prepare messages for bulk insert
      const messages = users.map((user) => ({
        recipient: user._id,
        sender: "Gitcord",
        subject,
        content,
        isRead: false,
      }));

      // Bulk insert messages
      const result = await models.Message.insertMany(messages);

      return NextResponse.json({
        success: true,
        message: `Message sent successfully to ${result.length} users`,
        data: {
          totalRecipients: result.length,
          subject,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error sending bulk message:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
