import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"
import Course from "../model/courseModel.js"
import mongoose from "mongoose"

// ─── GET CURRENT USER ────────────────────────────────────────────────────────
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password")
            .populate("enrolledCourses")
            .populate("courseProgress.course", "title lectures")

        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `GetCurrentUser error ${error.message}` })
    }
}

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { description, name } = req.body
        let photoUrl
        if (req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name, description, ...(photoUrl && { photoUrl }) },
            { new: true }
        ).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `updateProfile error ${error.message}` })
    }
}

// ─── MARK LECTURE COMPLETE ───────────────────────────────────────────────────
export const markLectureComplete = async (req, res) => {
    try {
        const userId = req.userId
        const { courseId, lectureId } = req.body

        if (!courseId || !lectureId) {
            return res.status(400).json({ message: "courseId and lectureId are required" })
        }

        // BUG FIX: validate ObjectId before using
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
            return res.status(400).json({ message: "Invalid courseId or lectureId" })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        const totalLectures = course.lectures.length

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // BUG FIX: compare using toString() consistently on both sides
        let progressEntry = user.courseProgress.find(
            p => p.course.toString() === courseId.toString()
        )

        if (!progressEntry) {
            user.courseProgress.push({
                course: courseId,
                completedLectures: [lectureId],
                lastWatched: lectureId,
                progressPercent: totalLectures > 0 ? Math.round((1 / totalLectures) * 100) : 0
            })
        } else {
            // BUG FIX: compare both sides as strings to avoid ObjectId vs string mismatch
            const alreadyDone = progressEntry.completedLectures
                .some(id => id.toString() === lectureId.toString())

            if (!alreadyDone) {
                progressEntry.completedLectures.push(new mongoose.Types.ObjectId(lectureId))
            }

            progressEntry.lastWatched = lectureId
            const completedCount = progressEntry.completedLectures.length
            progressEntry.progressPercent = totalLectures > 0
                ? Math.round((completedCount / totalLectures) * 100) : 0

            if (progressEntry.progressPercent === 100 && !progressEntry.completedAt) {
                progressEntry.completedAt = new Date()
            }
        }

        await user.save()

        // return updated progress entry
        const updated = user.courseProgress.find(
            p => p.course.toString() === courseId.toString()
        )

        // BUG FIX: return completedLectures as strings so frontend comparison works
        return res.status(200).json({
            message: "Lecture marked as complete",
            progress: {
                ...updated.toObject(),
                completedLectures: updated.completedLectures.map(id => id.toString())
            }
        })

    } catch (error) {
        return res.status(500).json({ message: `markLectureComplete error ${error.message}` })
    }
}

// ─── GET PROGRESS FOR ONE COURSE ─────────────────────────────────────────────
export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.userId
        const { courseId } = req.params

        // BUG FIX: validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid courseId" })
        }

        const user = await User.findById(userId).select("courseProgress")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const progressEntry = user.courseProgress.find(
            p => p.course.toString() === courseId.toString()
        )

        if (!progressEntry) {
            return res.status(200).json({
                completedLectures: [],
                progressPercent: 0,
                lastWatched: null,
                completedAt: null
            })
        }

        // BUG FIX: completedLectures as strings for frontend
        return res.status(200).json({
            ...progressEntry.toObject(),
            completedLectures: progressEntry.completedLectures.map(id => id.toString()),
            lastWatched: progressEntry.lastWatched?.toString() || null
        })

    } catch (error) {
        return res.status(500).json({ message: `getCourseProgress error ${error.message}` })
    }
}
