
import Course from "../model/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Escape special characters for MongoDB regex
const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input || !input.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const searchInput = input.trim();

        // 1. First search directly using user's query
        const searchRegex = new RegExp(
            escapeRegex(searchInput),
            "i"
        );

        let courses = await Course.find({
            isPublished: true,
            $or: [
                { title: searchRegex },
                { subTitle: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { level: searchRegex }
            ]
        });

        // Return direct search results if available
        if (courses.length > 0) {
            return res.status(200).json(courses);
        }

        // 2. If direct search fails, use Gemini AI
        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json([]);
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
You are an intelligent assistant for an LMS platform.

The user wants to learn: "${searchInput}"

Choose the most relevant course category from this list:
App Development
AI/ML
AI Tools
Data Science
Data Analytics
Ethical Hacking
UI UX Designing
Web Development
Others

Return only the category name.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const keyword = response.text?.trim();

        if (!keyword) {
            return res.status(200).json([]);
        }

        // 3. Search published courses using AI category
        const keywordRegex = new RegExp(
            escapeRegex(keyword),
            "i"
        );

        courses = await Course.find({
            isPublished: true,
            $or: [
                { category: keywordRegex },
                { title: keywordRegex },
                { subTitle: keywordRegex },
                { description: keywordRegex }
            ]
        });

        return res.status(200).json(courses);

    } catch (error) {
        console.error("AI Search Error:", error);

        return res.status(500).json({
            message: "Failed to search courses",
            error: error.message
        });
    }
};
