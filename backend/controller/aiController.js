import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import Course from "../model/courseModel.js"
import User from "../model/userModel.js"
dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MODEL = "gemini-2.5-flash"

// ─── Helper: call Gemini ───────────────────────────────────────────────────
async function gemini(prompt, systemInstruction = "") {
    const config = systemInstruction ? { systemInstruction } : {}
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config
    })
    return response.text
}

// ─── 1. AI Doubt Solver ───────────────────────────────────────────────────
export const doubtSolver = async (req, res) => {
    try {
        const { doubt, courseTitle, lectureTitle, chatHistory = [] } = req.body
        if (!doubt) return res.status(400).json({ message: "Doubt is required" })

        // Build conversation context
        const historyText = chatHistory.length > 0
            ? chatHistory.map(m => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`).join("\n")
            : ""

        const prompt = `${historyText ? historyText + "\n" : ""}Student: ${doubt}`

        const system = `You are an expert tutor helping a student with their course. 
Course: "${courseTitle || "General"}". Current Lecture: "${lectureTitle || "General"}".
Answer clearly and concisely. Use simple language. If code is needed, provide it.
Keep answers focused and under 200 words unless explanation requires more detail.`

        const answer = await gemini(prompt, system)
        return res.status(200).json({ answer })
    } catch (error) {
        return res.status(500).json({ message: `Doubt solver error: ${error}` })
    }
}

// ─── 2. AI Quiz Generator ─────────────────────────────────────────────────
export const generateQuiz = async (req, res) => {
    try {
        const { courseTitle, category, level, lectureTitle } = req.body
        if (!courseTitle) return res.status(400).json({ message: "Course info required" })

        const prompt = `Generate a quiz for:
Course: "${courseTitle}"
Category: "${category || "General"}"
Level: "${level || "Beginner"}"
${lectureTitle ? `Lecture: "${lectureTitle}"` : ""}

Create exactly 5 multiple choice questions. Return ONLY valid JSON, no markdown, no extra text:
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation why this is correct"
    }
  ]
}`

        const raw = await gemini(prompt)
        const clean = raw.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)
        return res.status(200).json(parsed)
    } catch (error) {
        return res.status(500).json({ message: `Quiz generation error: ${error}` })
    }
}

// ─── 3. AI Course Roadmap Generator ──────────────────────────────────────
export const generateRoadmap = async (req, res) => {
    try {
        const { goal, currentLevel, timeAvailable } = req.body
        if (!goal) return res.status(400).json({ message: "Learning goal is required" })

        // Fetch available courses to include real ones
        const courses = await Course.find({ isPublished: true }).select("title category level")
        const courseList = courses.map(c => `- ${c.title} (${c.category}, ${c.level})`).join("\n")

        const prompt = `A student wants to learn: "${goal}"
Current level: "${currentLevel || "Beginner"}"
Time available: "${timeAvailable || "1-2 hours/day"}"

Available courses on our platform:
${courseList}

Create a personalized learning roadmap. Return ONLY valid JSON, no markdown:
{
  "title": "Roadmap title",
  "totalDuration": "e.g. 3 months",
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "2 weeks",
      "description": "What you'll achieve",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "recommendedCourses": ["Course name from platform or general suggestion"]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`

        const raw = await gemini(prompt)
        const clean = raw.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)
        return res.status(200).json(parsed)
    } catch (error) {
        return res.status(500).json({ message: `Roadmap generation error: ${error}` })
    }
}

// ─── 4. AI Notes Generator ───────────────────────────────────────────────
export const generateNotes = async (req, res) => {
    try {
        const { lectureTitle, courseTitle, category } = req.body
        if (!lectureTitle) return res.status(400).json({ message: "Lecture title required" })

        const prompt = `Generate comprehensive study notes for:
Lecture: "${lectureTitle}"
Course: "${courseTitle || "General"}"
Category: "${category || "General"}"

Return ONLY valid JSON, no markdown:
{
  "title": "${lectureTitle}",
  "summary": "2-3 sentence overview",
  "keyPoints": [
    { "point": "Key concept", "detail": "Brief explanation" }
  ],
  "importantTerms": [
    { "term": "Term name", "definition": "Definition" }
  ],
  "practiceQuestions": ["Question 1?", "Question 2?", "Question 3?"],
  "quickTips": ["Tip 1", "Tip 2"]
}`

        const raw = await gemini(prompt)
        const clean = raw.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)
        return res.status(200).json(parsed)
    } catch (error) {
        return res.status(500).json({ message: `Notes generation error: ${error}` })
    }
}

// ─── 5. Smart Course Recommendations ─────────────────────────────────────
export const smartRecommendations = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findById(userId).populate("enrolledCourses")
        if (!user) return res.status(404).json({ message: "User not found" })

        const allCourses = await Course.find({ isPublished: true })

        // Courses not yet enrolled
        const enrolledIds = user.enrolledCourses.map(c => c._id.toString())
        const unenrolled = allCourses.filter(c => !enrolledIds.includes(c._id.toString()))

        if (unenrolled.length === 0) {
            return res.status(200).json({ recommendations: [], message: "You've enrolled in all courses!" })
        }

        const enrolledSummary = user.enrolledCourses.length > 0
            ? user.enrolledCourses.map(c => `${c.title} (${c.category})`).join(", ")
            : "No courses yet (new student)"

        const availableSummary = unenrolled.map(c =>
            `ID:${c._id}|${c.title}|${c.category}|${c.level}|₹${c.price || 0}`
        ).join("\n")

        const prompt = `A student has enrolled in: ${enrolledSummary}

Available courses (ID|Title|Category|Level|Price):
${availableSummary}

Recommend the top 4 most relevant courses for this student based on their interests.
Return ONLY valid JSON, no markdown:
{
  "recommendations": [
    {
      "courseId": "exact_id_from_list",
      "reason": "Why this course is perfect for them (1 sentence)"
    }
  ]
}`

        const raw = await gemini(prompt)
        const clean = raw.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)

        // Attach full course data to recommendations
        const enriched = parsed.recommendations
            .map(rec => {
                const course = unenrolled.find(c => c._id.toString() === rec.courseId)
                if (!course) return null
                return { ...course.toObject(), reason: rec.reason }
            })
            .filter(Boolean)

        return res.status(200).json({ recommendations: enriched })
    } catch (error) {
        return res.status(500).json({ message: `Recommendations error: ${error}` })
    }
}
