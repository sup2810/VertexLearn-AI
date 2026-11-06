import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
}, { timestamps: true })

wishlistSchema.index({ user: 1 }, { unique: true })

const Wishlist = mongoose.model("Wishlist", wishlistSchema)
export default Wishlist
