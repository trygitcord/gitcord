// GET /api/user/getUserProfile

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserStats from "@/models/userStats";
import UserPremium from "@/models/userPremium";
import { connect } from "@/lib/db";

export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Kullanıcı ID'sini al
        const userId = session.user.id;

        // UserStats ve UserPremium verilerini paralel olarak çek
        const [userStats, userPremium] = await Promise.all([
            UserStats.findById(userId),
            UserPremium.findById(userId),
        ]);

        // Eğer veriler yoksa oluştur
        if (!userStats) {
            await UserStats.create({ _id: userId });
        }
        if (!userPremium) {
            await UserPremium.create({ _id: userId });
        }

        // Tüm verileri birleştir
        const userProfile = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            stats: {
                credit: userStats?.credit || 0,
                view_count: userStats?.view_count || 0,
            },
            premium: {
                isPremium: userPremium?.premium || false,
                expiresAt: userPremium?.premium_expires_at || null,
                plan: userPremium?.premium_plan || 'free',
            },
        };

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
