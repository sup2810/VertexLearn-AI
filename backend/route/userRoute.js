import express from "express"
import isAuth from "../middleware/isAuth.js"
import {
    getCurrentUser,
    updateProfile,
    markLectureComplete,
    getCourseProgress
} from "../controller/userController.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

// existing routes
userRouter.get("/getcurrentuser", isAuth, getCurrentUser)
userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile)

// ── progress routes ──
userRouter.post("/progress",           isAuth, markLectureComplete)
userRouter.get("/progress/:courseId",  isAuth, getCourseProgress)

export default userRouter
