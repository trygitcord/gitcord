import { NextResponse, NextRequest } from "next/server";
import { withDb, DbModels } from "@/lib/withDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const POST = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { message, consentGiven } = body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
        );
      }

      // Message length validation (min 10, max 2000 characters)
      const trimmedMessage = message.trim();
      if (trimmedMessage.length < 10) {
        return NextResponse.json(
          { error: "Message must be at least 10 characters long" },
          { status: 400 }
        );
      }

      if (trimmedMessage.length > 1000) {
        return NextResponse.json(
          { error: "Message cannot exceed 1000 characters" },
          { status: 400 }
        );
      }

      if (consentGiven === undefined || typeof consentGiven !== "boolean") {
        return NextResponse.json(
          { error: "Consent status is required" },
          { status: 400 }
        );
      }

      const user = await models.User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Rate limiting: Check if user has submitted feedback in the last 2 hours
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const recentFeedback = await models.Feedback.findOne({
        userId: session.user.id,
        createdAt: { $gte: twoHoursAgo }
      });

      if (recentFeedback) {
        return NextResponse.json(
          { error: "You can only submit feedback once every 2 hours. Please try again later." },
          { status: 429 }
        );
      }

      const feedback = await models.Feedback.create({
        userId: session.user.id,
        username: user.username,
        message: trimmedMessage,
        consentGiven,
      });

      return NextResponse.json({
        success: true,
        message: "Feedback submitted successfully",
        data: {
          id: feedback._id,
          createdAt: feedback.createdAt,
        },
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);

export const GET = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = await models.User.findById(session.user.id);

      if (!currentUser || !currentUser.isModerator) {
        return NextResponse.json(
          { error: "Forbidden: Moderator access required" },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      const skip = (page - 1) * limit;

      const [feedbacks, total] = await Promise.all([
        models.Feedback.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        models.Feedback.countDocuments({}),
      ]);

      // Get user details for each feedback
      const feedbacksWithUserData = await Promise.all(
        feedbacks.map(async (feedback) => {
          const user = await models.User.findById(feedback.userId).select('avatar_url name username').lean();
          return {
            ...feedback,
            user: user || null
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          feedbacks: feedbacksWithUserData,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withDb(
  async (request: NextRequest, context: unknown, models: DbModels) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is moderator
      const currentUser = await models.User.findById(session.user.id);

      if (!currentUser || !currentUser.isModerator) {
        return NextResponse.json(
          { error: "Forbidden: Moderator access required" },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const feedbackId = searchParams.get("feedbackId");

      if (!feedbackId) {
        return NextResponse.json(
          { error: "Feedback ID is required" },
          { status: 400 }
        );
      }

      // Check if feedback exists
      const feedback = await models.Feedback.findById(feedbackId);
      if (!feedback) {
        return NextResponse.json(
          { error: "Feedback not found" },
          { status: 404 }
        );
      }

      // Delete the feedback
      await models.Feedback.findByIdAndDelete(feedbackId);

      return NextResponse.json({
        success: true,
        message: "Feedback deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);