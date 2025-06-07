import mongoose from 'mongoose';

const userPremiumSchema = new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      premium: {
        type: Boolean,
        default: false,
      },
      premium_expires_at: {
        type: Date,
        default: null,
      },
      premium_plan: {
        type: String,
        default: 'free',
      },
    },
    {
      timestamps: true,
    }
  );

const UserPremium = mongoose.models.UserPremium || mongoose.model('UserPremium', userPremiumSchema);

export default UserPremium;
