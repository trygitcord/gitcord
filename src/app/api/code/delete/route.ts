import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Code from "@/models/code";
import User from "@/models/user";
import { withDb } from "@/lib/withDb";

export const DELETE = withDb(async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Only moderators can delete codes
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isModerator) {
        return NextResponse.json({ error: "Forbidden: Only moderators can delete codes." }, { status: 403 });
    }
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "Missing code ID." }, { status: 400 });
    }
    try {
        const deleted = await Code.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Code not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete code." }, { status: 500 });
    }
}); 