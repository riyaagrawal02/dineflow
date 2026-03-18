import mongoose from "mongoose";

export const connectDb = async (mongoUri) => {
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not set");
    }
    await mongoose.connect(mongoUri);
    return mongoose.connection;
};
