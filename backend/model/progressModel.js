import mongoose from "mongoose"

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true })

// Compound index — ek user ka ek course mein ek hi progress record
progressSchema.index({ user: 1, course: 1 }, { unique: true })

const Progress = mongoose.model("Progress", progressSchema)
export default Progress
