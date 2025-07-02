import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { UserProfile, UserType } from "@/types/userTypes";

interface UserStatsDocument {
  _id: string;
  credit?: number;
  view_count?: number;
}

interface UserPremiumDocument {
  _id: string;
  premium?: boolean;
  premium_expires_at?: Date | null;
  premium_plan?: string;
}

export const GET = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      // Get username from URL search params
      const { searchParams } = new URL(request.url);
      const username = searchParams.get("username");

      if (!username) {
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 }
        );
      }

      // Convert username to lowercase for case-insensitive search
      const lowercaseUsername = username.toLowerCase();

      // Find user by username (case-insensitive)
      const user = (await models.User.findOne({
        username: { $regex: new RegExp(`^${lowercaseUsername}$`, "i") },
      }).lean()) as UserType | null;

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userId = user._id.toString();

      // Get user stats and premium info
      const [userStats, userPremium] = await Promise.all([
        models.UserStats.findOne({
          _id: userId,
        }).lean() as Promise<UserStatsDocument | null>,
        models.UserPremium.findOne({
          _id: userId,
        }).lean() as Promise<UserPremiumDocument | null>,
      ]);

      let statsData: UserStatsDocument;
      let premiumData: UserPremiumDocument;

      if (!userStats) {
        statsData = {
          _id: userId,
          credit: 0,
          view_count: 0,
        };

        await models.UserStats.create(statsData);
      } else {
        statsData = userStats;
      }

      if (!userPremium) {
        premiumData = {
          _id: userId,
          premium: false,
          premium_expires_at: null,
          premium_plan: "free",
        };

        await models.UserPremium.create(premiumData);
      } else {
        premiumData = userPremium;
      }

      // Increment view count
      await models.UserStats.findOneAndUpdate(
        { _id: userId },
        { $inc: { view_count: 1 } }
      );

      const fullProfile: UserProfile = {
        id: user._id.toString(),
        github_id: user.github_id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.avatar_url,
        github_profile_url: user.github_profile_url,
        avatar_url: user.avatar_url,
        role: user.role,
        isModerator: user.isModerator,
        stats: {
          _id: statsData._id,
          credit: statsData.credit || 0,
          view_count: statsData.view_count || 0,
        },
        premium: {
          _id: premiumData._id,
          isPremium: premiumData.premium || false,
          expiresAt: premiumData.premium_expires_at || null,
          plan: premiumData.premium_plan || "free",
        },
      };

      return NextResponse.json(fullProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
