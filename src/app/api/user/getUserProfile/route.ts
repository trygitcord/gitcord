// GET /api/user/getUserProfile

import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { withDb, DbModels } from "@/lib/withDb";
import { UserProfile, UserType } from "@/types/userTypes";
import { Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
    github_profile_url?: string | null;
    login?: string | null;
  };
}

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
  async (request: NextRequest, context: any, models: DbModels) => {
    try {
      const session = (await getServerSession(authOptions)) as CustomSession;

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = session.user.id;

      const [userStats, userPremium, user] = await Promise.all([
        models.UserStats.findOne({
          _id: userId,
        }).lean() as Promise<UserStatsDocument | null>,
        models.UserPremium.findOne({
          _id: userId,
        }).lean() as Promise<UserPremiumDocument | null>,
        models.User.findOne({
          github_id: userId,
        }).lean() as Promise<UserType | null>,
      ]);

      let statsData: UserStatsDocument;
      let premiumData: UserPremiumDocument;

      if (!userStats) {
        statsData = {
          _id: userId,
          credit: 0,
          view_count: 0,
        };

        const createdStats = await models.UserStats.create(statsData);
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

        const createdPremium = await models.UserPremium.create(premiumData);
      } else {
        premiumData = userPremium;
      }

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

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
