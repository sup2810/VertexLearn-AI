
import mongoose from "mongoose";

const connectDb = async () => {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
        throw new Error("MONGODB_URL is missing from backend/.env");
    }

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        if (error.reason?.servers) {
            for (const [host, server] of error.reason.servers) {
                console.error(
                    `${host}: ${server.error?.message || server.type}`
                );
            }
        }

        throw error;
    }
};

export default connectDb;
