import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/user";
import UserStats from "@/models/userStats";
import UserPremium from "@/models/userPremium";
import Message from "@/models/message";

let connectionPromise: Promise<typeof mongoose> | null = null;

const getModels = () => {
  return {
    User,
    UserStats,
    UserPremium,
    Message,
  };
};

export type DbModels = ReturnType<typeof getModels>;

export type WithDbHandler<T = unknown> = (
  req: NextRequest,
  context: T,
  models: DbModels
) => Promise<NextResponse> | NextResponse;

export function withDb<T = unknown>(handler: WithDbHandler<T>) {
  return async (req: NextRequest, context: T): Promise<NextResponse> => {
    try {
      const readyState = mongoose.connection.readyState;

      if (readyState === 1) {
        return await handler(req, context, getModels());
      }

      if (readyState === 2) {
        if (connectionPromise) {
          await connectionPromise;
        }
      } else {
        if (!connectionPromise || readyState === 0 || readyState === 3) {
          connectionPromise = connect();
        }

        await connectionPromise;
      }

      return await handler(req, context, getModels());
    } catch (error) {
      console.error("Database connection error in withDb:", error);

      if (mongoose.connection.readyState !== 1) {
        connectionPromise = null;
      }

      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
  };
}
