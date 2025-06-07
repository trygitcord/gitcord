import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
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
    username: String,
    bio: String,
    github_profile_url: String,
    role: {
        type: String,
        default: 'user'
    },
    isModerator: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    _id: false,
    versionKey: false
});

// Model zaten varsa onu kullan, yoksa yeni oluştur
const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema);

export default UserStats;
