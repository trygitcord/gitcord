import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const DELETE = withDb(
  async (request: NextRequest, context: any, models: DbModels) => {
    try {
      // Check authentication
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Get message ID from URL search params
      const { searchParams } = new URL(request.url);
      const messageId = searchParams.get("messageId");

      if (!messageId) {
        return NextResponse.json(
          { error: "Message ID is required" },
          { status: 400 }
        );
      }

      // Find message and verify ownership
      const message = await models.Message.findOne({
        _id: messageId,
        recipient: session.user.id,
      });

      if (!message) {
        return NextResponse.json(
          {
            error:
              "Message not found or you don't have permission to delete it",
          },
          { status: 404 }
        );
      }

      // Delete the message
      await models.Message.deleteOne({
        _id: messageId,
        recipient: session.user.id,
      });

      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
        data: {
          deletedMessageId: messageId,
        },
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
