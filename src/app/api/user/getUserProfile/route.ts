// GET /api/user/getUserProfile

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserStats from "@/models/userStats";
import UserPremium from "@/models/userPremium";
import { connect } from "@/lib/db";
import { UserProfile } from "@/types/userTypes";
import { Session } from "next-auth";

type UserProfileKey = keyof UserProfile;

interface CustomSession extends Session {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        bio?: string | null;
        github_profile_url?: string | null;
    }
}

interface UserStatsDocument {
    _id: string;
    username?: string;
    bio?: string;
    github_profile_url?: string;
    role?: string;
    isModerator?: boolean;
    credit?: number;
    view_count?: number;
}

interface UserPremiumDocument {
    _id: string;
    premium?: boolean;
    premium_expires_at?: Date | null;
    premium_plan?: string;
}

export async function GET(request: Request) {
    try {
        await connect();
        const session = await getServerSession(authOptions) as CustomSession;

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // URL'den query parametrelerini al
        const { searchParams } = new URL(request.url);
        const fields = searchParams.get('fields')?.split(',') || [];

        // Kullanıcı ID'sini al
        const userId = session.user.id;

        // UserStats ve UserPremium verilerini paralel olarak çek
        const [userStats, userPremium] = await Promise.all([
            UserStats.findOne({ _id: userId.toString() }).lean() as Promise<UserStatsDocument | null>,
            UserPremium.findOne({ _id: userId.toString() }).lean() as Promise<UserPremiumDocument | null>,
        ]);

        // Eğer veriler yoksa oluştur
        if (!userStats) {
            await UserStats.create({ _id: userId.toString() });
        }
        if (!userPremium) {
            await UserPremium.create({ _id: userId.toString() });
        }

        // Tüm verileri birleştir
        const fullProfile: UserProfile = {
            id: session.user.id,
            name: session.user.name,
            username: userStats?.username,
            email: session.user.email,
            bio: session.user.bio || "",
            image: session.user.image,
            github_profile_url: session.user.github_profile_url || "",
            avatar_url: session.user.image || "",
            role: userStats?.role || "user",
            isModerator: userStats?.isModerator || false,
            stats: {
                _id: session.user.id,
                credit: userStats?.credit || 0,
                view_count: userStats?.view_count || 0,
            },
            premium: {
                _id: session.user.id,
                isPremium: userPremium?.premium || false,
                expiresAt: userPremium?.premium_expires_at || null,
                plan: userPremium?.premium_plan || 'free',
            },
        };

        // Eğer fields parametresi varsa, sadece istenen alanları döndür
        if (fields.length > 0) {
            const filteredProfile: Record<string, any> = {};
            fields.forEach(field => {
                if (field.includes('.')) {
                    // Nested fields için (örn: stats.credit)
                    const [parent, child] = field.split('.');
                    if (parent in fullProfile && child in (fullProfile[parent as UserProfileKey] as object)) {
                        if (!filteredProfile[parent]) {
                            filteredProfile[parent] = {};
                        }
                        filteredProfile[parent][child] = (fullProfile[parent as UserProfileKey] as any)[child];
                    }
                } else if (field in fullProfile) {
                    const key = field as UserProfileKey;
                    filteredProfile[field] = fullProfile[key];
                }
            });
            return NextResponse.json(filteredProfile);
        }

        return NextResponse.json(fullProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
