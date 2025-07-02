import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/userTypes";
import { MessageType } from "@/models/message";

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

      // Get user ID from query params
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      // Get user details
      const user = (await models.User.findById(userId)
        .select(
          "_id name username email bio avatar_url github_profile_url isModerator createdAt"
        )
        .lean()) as (UserType & { createdAt: Date }) | null;

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get user's message statistics
      const [totalMessagesReceived, unreadMessages] = await Promise.all([
        models.Message.countDocuments({ recipient: userId }),
        models.Message.countDocuments({ recipient: userId, isRead: false }),
      ]);

      // Get last message sent to this user (if any)
      const lastMessage = (await models.Message.findOne({ recipient: userId })
        .sort({ createdAt: -1 })
        .select("subject createdAt isRead")
        .lean()) as MessageType | null;

      const response = {
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            avatar_url: user.avatar_url,
            github_profile_url: user.github_profile_url,
            isModerator: user.isModerator,
            createdAt: user.createdAt,
          },
          messageStats: {
            totalMessagesReceived,
            unreadMessages,
            lastMessage: lastMessage
              ? {
                  subject: lastMessage.subject,
                  createdAt: lastMessage.createdAt,
                  isRead: lastMessage.isRead,
                }
              : null,
          },
        },
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error fetching user details:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
