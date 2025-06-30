import { Schema, model, models } from "mongoose";

interface MessageType {
  _id?: string;
  recipient: string;
  sender: string;
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<MessageType>(
  {
    recipient: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    sender: {
      type: String,
      default: "Gitcord",
      immutable: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for efficient queries
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

const Message = models.Message || model<MessageType>("Message", messageSchema);

export default Message;
export type { MessageType };
