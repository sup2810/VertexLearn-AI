import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:["student","educator"],
        required:true
    },
    photoUrl:{
        type:String,
        default:""
    },
    enrolledCourses:[{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }],

    // ── PROGRESS TRACKING (new) ──────────────────────────────────────
    courseProgress:[{
        course:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
            required:true
        },
        completedLectures:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }],
        // auto-updated by backend
        progressPercent:{
            type:Number,
            default:0,
            min:0,
            max:100
        },
        lastWatched:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture",
            default:null
        },
        completedAt:{
            type:Date,
            default:null
        }
    }],
    // ────────────────────────────────────────────────────────────────

    resetOtp:{
      type:String
    },
    otpExpires:{
      type:Date
    },
    isOtpVerifed:{
      type:Boolean,
      default:false
    }

},{timestamps:true})

const User = mongoose.model("User" , userSchema)

export default User
