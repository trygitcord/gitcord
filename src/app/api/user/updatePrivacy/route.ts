import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { withDb, DbModels } from "@/lib/withDb";

export const POST = withDb(
  async (req: NextRequest, _context: unknown, models: DbModels) => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user?.email) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const { isPrivate } = await req.json();

      if (typeof isPrivate !== "boolean") {
        return NextResponse.json(
          { error: "Invalid privacy setting" },
          { status: 400 }
        );
      }

      const user = await models.User.findOneAndUpdate(
        { email: session.user.email },
        { isPrivate },
        { new: true }
      );

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        isPrivate: user.isPrivate,
      });
    } catch (error) {
      console.error("Error updating privacy setting:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);