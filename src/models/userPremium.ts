import { Schema, model, models } from 'mongoose';

interface UserPremiumType {
    _id: string;
    premium: boolean;
    premium_expires_at: Date | null;
    premium_plan: string;
}

const userPremiumSchema = new Schema<UserPremiumType>(
    {
        _id: {
            type: String,
            required: true
        },
        premium: {
            type: Boolean,
            default: false
        },
        premium_expires_at: {
            type: Date,
            default: null
        },
        premium_plan: {
            type: String,
            default: 'free'
        }
    },
    {
        timestamps: true,
        _id: false,
        versionKey: false
    }
);

// Model zaten varsa onu kullan, yoksa yeni oluştur
const UserPremium = models.UserPremium || model<UserPremiumType>('UserPremium', userPremiumSchema);

export default UserPremium;
