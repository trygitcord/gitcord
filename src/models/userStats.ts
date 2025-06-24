import { Schema, model, models } from 'mongoose';

interface UserStatsType {
    _id: string;
    credit: number;
    view_count: number;
}

const userStatsSchema = new Schema<UserStatsType>(
    {
        _id: {
            type: String,
            required: true
        },
        credit: {
            type: Number,
            default: 0
        },
        view_count: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
        _id: false,
        versionKey: false
    }
);

// Model zaten varsa onu kullan, yoksa yeni oluştur
const UserStats = models.UserStats || model<UserStatsType>('UserStats', userStatsSchema);

export default UserStats;
