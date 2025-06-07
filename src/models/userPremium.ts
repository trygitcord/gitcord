import mongoose from 'mongoose';

const userPremiumSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    _id: false,
    versionKey: false
});

// Model zaten varsa onu kullan, yoksa yeni oluştur
const UserPremium = mongoose.models.UserPremium || mongoose.model('UserPremium', userPremiumSchema);

export default UserPremium;
