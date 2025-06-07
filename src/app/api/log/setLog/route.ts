// POST /api/log/setLog

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Log from "@/models/log";
import mongoose from "mongoose";

export async function POST(request: Request) {
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

        // MongoDB bağlantısını kontrol et
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // Log kaydını oluştur
        const log = await Log.create({
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
}
