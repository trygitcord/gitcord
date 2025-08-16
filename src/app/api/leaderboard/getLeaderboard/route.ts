import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { withDb, DbModels } from "@/lib/withDb";
import { authOptions } from "@/lib/auth";
import { createGithubRequest } from "@/lib/axios-server";

export const dynamic = "force-dynamic";

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: {
    pull_request?: unknown;
    issue?: unknown;
  };
}

interface LeaderboardUser {
  _id: string;
  username: string;
  name: string;
  avatar_url: string;
  github_profile_url: string;
  weeklyScore: number;
  pushEvents: number;
  pullRequests: number;
  issues: number;
  lastActivityDate?: string;
  daysIncluded?: number;
}

interface UserDocument {
  _id: string;
  username: string;
  name: string;
  avatar_url: string;
  github_profile_url: string;
  isModerator: boolean;
}

// GitHub Events API'den son 7 günlük aktiviteleri al
async function getWeeklyActivity(username: string, githubToken?: string) {
  try {
    // Son 7 günün başlangıç tarihini hesapla (bugün dahil)
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Günün başlangıcına ayarla

    // Server-side axios instance'ı oluştur
    const githubApi = createGithubRequest(githubToken);

    // GitHub Events API maksimum 100 event döner ve son 90 günü kapsar
    const response = await githubApi.get(
      `/users/${username}/events/public?per_page=100`
    );

    const events: GitHubEvent[] = response.data;

    // Son 7 günün eventlerini filtrele (tarih karşılaştırması)
    const weeklyEvents = events.filter((event) => {
      const eventDate = new Date(event.created_at);
      return eventDate >= sevenDaysAgo && eventDate <= now;
    });

    let pushEvents = 0;
    let pullRequests = 0;
    let issues = 0;
    let lastActivityDate: Date | undefined;

    weeklyEvents.forEach((event) => {
      const eventDate = new Date(event.created_at);

      // En son aktivite tarihini kaydet
      if (!lastActivityDate || eventDate > lastActivityDate) {
        lastActivityDate = eventDate;
      }

      switch (event.type) {
        case "PushEvent":
          pushEvents++;
          break;
        case "PullRequestEvent":
          pullRequests++;
          break;
        case "IssuesEvent":
          issues++;
          break;
      }
    });

    // Puan hesaplama: PushEvent 2x, PR 4x, Issues 3x
    const weeklyScore = pushEvents * 2 + pullRequests * 4 + issues * 3;

    // Kaç günlük veri dahil edildiğini hesapla
    const daysIncluded = Math.floor(
      (now.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      weeklyScore,
      pushEvents,
      pullRequests,
      issues,
      lastActivityDate: lastActivityDate
        ? lastActivityDate.toISOString()
        : undefined,
      daysIncluded,
    };
  } catch (error) {
    console.error(`Error fetching activity for ${username}:`, error);
    return {
      weeklyScore: 0,
      pushEvents: 0,
      pullRequests: 0,
      issues: 0,
      lastActivityDate: undefined,
      daysIncluded: 7,
    };
  }
}

export const GET = withDb(
  async (req: NextRequest, context: unknown, models: DbModels) => {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Tüm kullanıcıları al
      const users = (await models.User.find({}).select(
        "_id username name avatar_url github_profile_url isModerator"
      )) as UserDocument[];

      // Her kullanıcı için haftalık aktiviteleri al ve puan hesapla
      const leaderboardData: LeaderboardUser[] = await Promise.all(
        users.map(async (user: UserDocument) => {
          const activity = await getWeeklyActivity(
            user.username,
            (session as { accessToken?: string }).accessToken
          );

          return {
            _id: user._id,
            username: user.username,
            name: user.name,
            avatar_url: user.avatar_url,
            github_profile_url: user.github_profile_url,
            isModerator: user.isModerator,
            ...activity,
          };
        })
      );

      // Puana göre sırala (büyükten küçüğe)
      leaderboardData.sort((a, b) => b.weeklyScore - a.weeklyScore);

      return NextResponse.json({
        success: true,
        data: leaderboardData,
        lastUpdated: new Date().toISOString(),
        period: {
          days: 7,
          from: new Date(
            new Date().setDate(new Date().getDate() - 7)
          ).toISOString(),
          to: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Leaderboard API error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
