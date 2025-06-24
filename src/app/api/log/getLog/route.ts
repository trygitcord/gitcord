// GET /api/log/getLog

import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { withDb, DbModels } from "@/lib/withDb";

export const GET = withDb(async (request: NextRequest, context: any, models: DbModels) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");
        const method = searchParams.get("method");
        const endpoint = searchParams.get("endpoint");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Filtreleme kriterlerini oluştur
        const filter: any = { userId: session.user.id };
        if (action) filter.action = action;
        if (method) filter.method = method;
        if (endpoint) filter.endpoint = endpoint;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Logları getir
        const [logs, total] = await Promise.all([
            models.Log.find(filter)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
            models.Log.countDocuments(filter)
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                limit,
                offset,
                total,
                hasMore: offset + limit < total
            }
        });
    } catch (error) {
        console.error("Error getting logs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
});
