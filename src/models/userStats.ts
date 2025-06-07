import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      credit: {
        type: Number,
        default: 0,
      },
      view_count: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema);

export default UserStats;
