// =================== route/aiRoute.js ===================
import express from "express"
import isAuth from "../middleware/isAuth.js"
import { doubtSolver, generateQuiz, generateRoadmap, generateNotes, smartRecommendations } from "../controller/aiController.js"

const aiRouter = express.Router()

aiRouter.post("/doubt", isAuth, doubtSolver)
aiRouter.post("/quiz", isAuth, generateQuiz)
aiRouter.post("/roadmap", isAuth, generateRoadmap)
aiRouter.post("/notes", isAuth, generateNotes)
aiRouter.get("/recommendations", isAuth, smartRecommendations)

export default aiRouter
