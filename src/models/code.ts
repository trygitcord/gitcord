import { Schema, model, models } from "mongoose";

interface CodeType {
  _id?: string;
  code: string;
  credit: number;
  premium: boolean;
  premiumDays: number;
  usageLimit?: number;
  usedCount: number;
}

const codeSchema = new Schema<CodeType>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    credit: {
      type: Number,
      required: true,
      min: 0,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    premiumDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Code = models.Code || model<CodeType>("Code", codeSchema);

export default Code;
export type { CodeType };
