import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || ''

export const connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            await mongoose.disconnect();
        }

        await mongoose.connect(MONGODB_URI, {
            autoIndex: true,
            autoCreate: true,
        });

        // Tüm modelleri temizle
        Object.keys(mongoose.models).forEach(modelName => {
            delete mongoose.models[modelName];
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
