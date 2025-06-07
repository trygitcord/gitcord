// GET /api/log/getLog

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Log from "@/models/log";
import mongoose from "mongoose";

export async function GET(request: Request) {
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

        // MongoDB bağlantısını kontrol et
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

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
            Log.find(filter)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
            Log.countDocuments(filter)
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
}
