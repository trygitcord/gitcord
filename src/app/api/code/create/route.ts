import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Code, { CodeType } from "@/models/code";
import User from "@/models/user";
import { withDb } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";

export const POST = withDb(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is moderator
  const user = await User.findOne({ email: session.user.email });
  if (!user || !user.isModerator) {
    return NextResponse.json(
      { error: "Forbidden: Only moderators can create codes." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { code, credit, premium, premiumDays, usageLimit } = body;

  if (!code || typeof credit !== "number") {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const newCode: CodeType = {
      code,
      credit,
      premium: !!premium,
      premiumDays: premiumDays || 0,
      usageLimit: usageLimit || 1,
      usedCount: 0,
    };
    const created = await Code.create(newCode);
    return NextResponse.json({ success: true, data: created });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create code.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
