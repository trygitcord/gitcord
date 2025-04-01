import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      password: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
