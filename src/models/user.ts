import { Schema, model, models } from 'mongoose';
import { UserType } from '@/types/userTypes';

const userSchema = new Schema<UserType>(
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
      },
      bio: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      avatar_url: {
        type: String,
        required: true,
      },
      github_profile_url: {
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




const User = models.User || model<UserType>('User', userSchema);

export default User;
