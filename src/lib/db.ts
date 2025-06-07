import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || ''

export const connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
