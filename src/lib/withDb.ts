import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { connect } from './db';

let connectionPromise: Promise<typeof mongoose> | null = null;


const getModels = () => {
  const User = require('@/models/user').default;
  const UserStats = require('@/models/userStats').default;
  const UserPremium = require('@/models/userPremium').default;

  return {
    User,
    UserStats,
    UserPremium,
  };
};

export type DbModels = ReturnType<typeof getModels>;

export type WithDbHandler<T = any> = (
  req: NextRequest,
  context: T,
  models: DbModels
) => Promise<NextResponse> | NextResponse;

export function withDb<T = any>(handler: WithDbHandler<T>) {
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
      console.error('Database connection error in withDb:', error);

      if (mongoose.connection.readyState !== 1) {
        connectionPromise = null;
      }

      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
  };
}
