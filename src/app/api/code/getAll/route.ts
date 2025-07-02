import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Code from "@/models/code";
import User from "@/models/user";
import { withDb } from "@/lib/withDb";

export const GET = withDb(async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Only moderators can list codes
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isModerator) {
        return NextResponse.json({ error: "Forbidden: Only moderators can view codes." }, { status: 403 });
    }
    try {
        const codes = await Code.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: codes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch codes." }, { status: 500 });
    }
}); 