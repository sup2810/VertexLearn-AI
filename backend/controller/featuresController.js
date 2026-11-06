import Progress from "../model/progressModel.js"
import Course from "../model/courseModel.js"
import Wishlist from "../model/wishlistModel.js"
import User from "../model/userModel.js"
import PDFDocument from "pdfkit"

// ─── PROGRESS ────────────────────────────────────────────────────────────

export const markLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body
        const userId = req.userId

        const course = await Course.findById(courseId).populate("lectures")
        if (!course) return res.status(404).json({ message: "Course not found" })

        let progress = await Progress.findOne({ user: userId, course: courseId })

        if (!progress) {
            progress = await Progress.create({
                user: userId,
                course: courseId,
                completedLectures: [lectureId]
            })
        } else {
            if (!progress.completedLectures.includes(lectureId)) {
                progress.completedLectures.push(lectureId)
            }
        }

        const totalLectures = course.lectures.length
        if (progress.completedLectures.length >= totalLectures && totalLectures > 0) {
            progress.isCompleted = true
            progress.completedAt = new Date()
        }

        await progress.save()
        return res.status(200).json(progress)
    } catch (error) {
        return res.status(500).json({ message: `Progress error: ${error}` })
    }
}

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        const progress = await Progress.findOne({ user: userId, course: courseId })
        const course = await Course.findById(courseId).populate("lectures")

        if (!course) return res.status(404).json({ message: "Course not found" })

        const totalLectures = course.lectures.length
        const completedCount = progress?.completedLectures?.length || 0
        const percentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0

        return res.status(200).json({
            completedLectures: progress?.completedLectures || [],
            isCompleted: progress?.isCompleted || false,
            completedAt: progress?.completedAt || null,
            percentage,
            totalLectures,
            completedCount
        })
    } catch (error) {
        return res.status(500).json({ message: `Get progress error: ${error}` })
    }
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────

export const generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        const progress = await Progress.findOne({ user: userId, course: courseId })
        if (!progress?.isCompleted) {
            return res.status(400).json({ message: "Complete the course first to get certificate" })
        }

        const user = await User.findById(userId).select("-password")
        // BUG FIX: creator name populate karo
        const course = await Course.findById(courseId).populate("creator", "name")

        if (!user || !course) return res.status(404).json({ message: "Not found" })

        const completedDate = progress.completedAt
            ? new Date(progress.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

        // Student aur Instructor ke names
        const studentName = user.name || "Student"
        const instructorName = course.creator?.name || "VertexLearn AI Educator"

        // Build PDF
        const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 })

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=certificate-${courseId}.pdf`)
        doc.pipe(res)

        const W = 841.89, H = 595.28

        // Background
        doc.rect(0, 0, W, H).fill("#f8f7f4")

        // Border decoration
        doc.rect(20, 20, W - 40, H - 40).lineWidth(2).stroke("#6c63ff")
        doc.rect(28, 28, W - 56, H - 56).lineWidth(0.5).stroke("#6c63ff")

        // Top & bottom accent bar
        doc.rect(0, 0, W, 8).fill("#6c63ff")
        doc.rect(0, H - 8, W, 8).fill("#6c63ff")

        // Corner dots
        const corners = [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]]
        corners.forEach(([x, y]) => {
            doc.circle(x, y, 6).fill("#6c63ff")
        })

        // VetrexLearnAI brand
        doc.fontSize(13).font("Helvetica-Bold").fillColor("#6c63ff")
            .text("", 0, 55, { align: "center" })

        // Title
        doc.fontSize(36).font("Helvetica-Bold").fillColor("#0f0e0d")
            .text("Certificate of Completion", 0, 90, { align: "center" })

        // Divider
        doc.moveTo(200, 148).lineTo(W - 200, 148).lineWidth(1).stroke("#6c63ff")

        // This certifies
        doc.fontSize(14).font("Helvetica").fillColor("#5a5855")
            .text("This is to certify that", 0, 165, { align: "center" })

        // Student name (bold italic)
        doc.fontSize(44).font("Helvetica-BoldOblique").fillColor("#0f0e0d")
            .text(studentName, 0, 190, { align: "center" })

        // Name underline
        const nameWidth = doc.widthOfString(studentName, { fontSize: 44 })
        const nameX = (W - Math.min(nameWidth, 500)) / 2
        doc.moveTo(nameX, 248).lineTo(W - nameX, 248).lineWidth(1).stroke("#ddd")

        // Has successfully completed
        doc.fontSize(14).font("Helvetica").fillColor("#5a5855")
            .text("has successfully completed the course", 0, 262, { align: "center" })

        // Course name
        doc.fontSize(26).font("Helvetica-Bold").fillColor("#6c63ff")
            .text(course.title, 60, 288, { align: "center", width: W - 120 })

        // Category & Level
        const meta = [course.category, course.level].filter(Boolean).join("  ·  ")
        if (meta) {
            doc.fontSize(12).font("Helvetica").fillColor("#9a9793")
                .text(meta, 0, 330, { align: "center" })
        }

        // Divider before footer
        doc.moveTo(200, 365).lineTo(W - 200, 365).lineWidth(0.5).stroke("#ddd")

        // Date + Instructor label
        doc.fontSize(11).font("Helvetica").fillColor("#5a5855")
        doc.text(`Completed on: ${completedDate}`, 120, 382)
        doc.text(`Instructor: ${instructorName}`, W - 350, 382)

        // ── SIGNATURE LINES ──────────────────────────────────────────

        // Left signature line (Student)
        doc.moveTo(120, 435).lineTo(340, 435).lineWidth(1).stroke("#0f0e0d")
        // Student name below line
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#0f0e0d")
            .text(studentName, 120, 440, { width: 220, align: "center" })
        doc.fontSize(10).font("Helvetica").fillColor("#9a9793")
            .text("Student", 120, 456, { width: 220, align: "center" })

        // Right signature line (Instructor/Authorized)
        doc.moveTo(W - 340, 435).lineTo(W - 120, 435).lineWidth(1).stroke("#0f0e0d")
        // Instructor name below line
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#0f0e0d")
            .text(instructorName, W - 340, 440, { width: 220, align: "center" })
        doc.fontSize(10).font("Helvetica").fillColor("#9a9793")
            .text("Authorized Signatory", W - 340, 456, { width: 220, align: "center" })

        // Certificate ID
        const certId = `EV-${courseId.toString().slice(-6).toUpperCase()}-${userId.toString().slice(-6).toUpperCase()}`
        doc.fontSize(9).fillColor("#c0bdb9")
            .text(`Certificate ID: ${certId}`, 0, H - 28, { align: "center" })

        doc.end()
    } catch (error) {
        return res.status(500).json({ message: `Certificate error: ${error}` })
    }
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────

export const toggleWishlist = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.userId

        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, courses: [courseId] })
            return res.status(200).json({ wishlist, added: true })
        }

        const isAdded = wishlist.courses.includes(courseId)
        if (isAdded) {
            wishlist.courses = wishlist.courses.filter(id => id.toString() !== courseId)
        } else {
            wishlist.courses.push(courseId)
        }

        await wishlist.save()
        return res.status(200).json({ wishlist, added: !isAdded })
    } catch (error) {
        return res.status(500).json({ message: `Wishlist error: ${error}` })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const userId = req.userId
        const wishlist = await Wishlist.findOne({ user: userId }).populate({
            path: "courses",
            populate: { path: "reviews" }
        })

        return res.status(200).json(wishlist?.courses || [])
    } catch (error) {
        return res.status(500).json({ message: `Get wishlist error: ${error}` })
    }
}
