import { Schema, model, models } from 'mongoose';
import { LogTypes } from '@/types/logTypes';

const logSchema = new Schema<LogTypes>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'UPDATE',
        'DELETE',
        'VIEW',
        'OTHER'
      ],
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    endpoint: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ action: 1, createdAt: -1 });
logSchema.index({ method: 1, endpoint: 1 });

// Model zaten varsa onu kullan, yoksa yeni oluştur
const Log = models.Log || model<LogTypes>('Log', logSchema);

export default Log;
