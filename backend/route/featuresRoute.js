// =================== route/featuresRoute.js ===================
import express from "express"
import isAuth from "../middleware/isAuth.js"
import {
    markLectureComplete,
    getCourseProgress,
    generateCertificate,
    toggleWishlist,
    getWishlist
} from "../controller/featuresController.js"

const featuresRouter = express.Router()

// Progress
featuresRouter.post("/progress/mark", isAuth, markLectureComplete)
featuresRouter.get("/progress/:courseId", isAuth, getCourseProgress)

// Certificate
featuresRouter.get("/certificate/:courseId", isAuth, generateCertificate)

// Wishlist
featuresRouter.post("/wishlist/toggle", isAuth, toggleWishlist)
featuresRouter.get("/wishlist", isAuth, getWishlist)

export default featuresRouter
