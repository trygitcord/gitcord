import mongoose from "mongoose";

export interface LogTypes extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  action: 'LOGIN' | 'LOGOUT' | 'UPDATE' | 'DELETE' | 'VIEW' | 'OTHER';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  details: any;
  createdAt: Date;
}
