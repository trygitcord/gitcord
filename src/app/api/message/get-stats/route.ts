import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = withDb(
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

      // Get total message statistics
      const [totalMessages, totalUnreadMessages, totalUsers] =
        await Promise.all([
          models.Message.countDocuments(),
          models.Message.countDocuments({ isRead: false }),
          models.User.countDocuments(),
        ]);

      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          totalMessages,
          totalUnreadMessages,
        },
      });
    } catch (error) {
      console.error("Error fetching message stats:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
