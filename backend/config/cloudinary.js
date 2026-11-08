import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("Cloudinary environment check:", {
    cloudNameExists: !!process.env.CLOUDINARY_CLOUD_NAME,
    apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
    apiSecretExists: !!process.env.CLOUDINARY_API_SECRET
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    if (!filePath) return null;

    try {
        const uploadResult = await cloudinary.uploader.upload(
            filePath,
            { resource_type: "image" }
        );

        return uploadResult.secure_url;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;

    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export default uploadOnCloudinary;