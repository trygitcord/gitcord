import { Schema, model, models } from 'mongoose';

export interface FeedbackType {
  _id?: string;
  userId: string;
  username: string;
  message: string;
  consentGiven: boolean;
  type?: "bug" | "feature" | "request";
  createdAt?: Date;
  updatedAt?: Date;
}

const feedbackSchema = new Schema<FeedbackType>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    consentGiven: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: String,
      enum: ["bug", "feature", "request"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback = models.Feedback || model<FeedbackType>('Feedback', feedbackSchema);

export default Feedback;