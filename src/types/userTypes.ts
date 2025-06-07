import mongoose from "mongoose";

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  github_id: string;
  name: string;
  username: string;
  bio: string;
  email: string;
  github_profile_url: string;
  avatar_url: string;
  role: string;
  isModerator: boolean;
}

export interface UserPremiumType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  premium: boolean;
  premium_expires_at: Date;
  premium_plan: string;
}

export interface UserStatsType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  credit: number;
  view_count: number;
}
