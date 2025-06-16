import mongoose from 'mongoose';
import { UserType } from '@/types/userTypes';

const userSchema = new mongoose.Schema<UserType>(
    {
      _id: {
        type: String,
        required: true,
      },
      github_id: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      bio: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      github_profile_url: {
        type: String,
        required: true,
      },
      avatar_url: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: 'user',
      },
      isModerator: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
