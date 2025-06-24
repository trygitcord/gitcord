// POST /api/log/setLog

import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { withDb, DbModels } from "@/lib/withDb";

export const POST = withDb(async (request: NextRequest, context: any, models: DbModels) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, method, endpoint, statusCode, details } = body;

        // Gerekli alanları kontrol et
        if (!action || !method || !endpoint || !statusCode) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Log kaydını oluştur
        const log = await models.Log.create({
            userId: session.user.id,
            action,
            method,
            endpoint,
            statusCode,
            details: details || {},
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error("Error setting log:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
});
