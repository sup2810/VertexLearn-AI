import {
    uploadImageOnCloudinary,
    uploadVideoOnCloudinary
} from "../config/cloudinary.js";
import Course from "../model/courseModel.js"
import Lecture from "../model/lectureModel.js"
import User from "../model/userModel.js"

// for Course

export const createCourse = async (req, res) => {
    try {
        const {
            title,
            subTitle,
            description,
            category,
            level,
            price
        } = req.body;

        if (!title || !category) {
            return res.status(400).json({
                message: "Course title and category are required"
            });
        }

        let thumbnailUrl = "";

        if (req.file) {
            thumbnailUrl = await uploadImageOnCloudinary(req.file.path);
        }

        const course = await Course.create({
            title,
            subTitle,
            description,
            category,
            level: level || "Beginner",
            price: Number(price) || 0,
            thumbnail: thumbnailUrl,
            creator: req.userId
        });

        return res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Create course error:", error);

        return res.status(500).json({
            message: "Failed to create course",
            error: error.message
        });
    }
};


export const getPublishedCourses = async (req,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate("lectures reviews")
        if(!courses){
             return res.status(400).json({message:"Courses are not found"})
        }
         return res.status(200).json(courses)
    } catch (error) {
          return res.status(500).json({message:`failed to get isPublished Courses  ${error}`})
    }
}

export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({creator:userId})
        if(!courses){
             return res.status(400).json({message:"Courses are not found"})
        }
         return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({message:`failed to get Creator Courses ${error}`})
    }
}


export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            creator: req.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or unauthorized"
            });
        }

        const fields = [
            "title",
            "subTitle",
            "description",
            "category",
            "level",
            "price",
            "isPublished"
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                course[field] =
                    field === "isPublished"
                        ? req.body[field] === true ||
                          req.body[field] === "true"
                        : req.body[field];
            }
        });

        if (req.file) {
            const thumbnailUrl =
    await uploadImageOnCloudinary(req.file.path);

            if (!thumbnailUrl) {
                return res.status(500).json({
                    message: "Thumbnail upload failed"
                });
            }

            course.thumbnail = thumbnailUrl;
        }

        await course.save();

        return res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.error("Edit course error:", error);

        return res.status(500).json({
            message: "Failed to edit course",
            error: error.message
        });
    }
};




export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            creator: req.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or unauthorized"
            });
        }

        return res.status(200).json(course);

    } catch (error) {
        return res.status(500).json({
            message: "Failed to get course",
            error: error.message
        });
    }
};


export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            creator: req.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or unauthorized"
            });
        }

        // Delete associated lectures
        await Lecture.deleteMany({
            _id: { $in: course.lectures }
        });

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course and its lectures removed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete course",
            error: error.message
        });
    }
};


//for Lecture


export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle) {
            return res.status(400).json({
                message: "Lecture title is required"
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            creator: req.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or unauthorized"
            });
        }

        const lecture = await Lecture.create({
            lectureTitle
        });

        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({
            message: "Lecture created successfully",
            lecture,
            course
        });

    } catch (error) {
        return res.status(500).json({
            message: "Create lecture failed",
            error: error.message
        });
    }
};


export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
          return res.status(404).json({message:"Course is not found"})
        }
       await course.populate("lectures")
       return res.status(200).json(course)


    } catch (error) {
         return res.status(500).json({message:`failed to getCourseLecture ${error}`})
    }
}



export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { lectureTitle, isPreviewFree } = req.body;

        // Validate lecture ID
        if (!lectureId) {
            return res.status(400).json({
                message: "Lecture ID is required"
            });
        }

        // Find lecture
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            });
        }

        // Check course ownership
        const course = await Course.findOne({
            lectures: lectureId,
            creator: req.userId
        });

        if (!course) {
            return res.status(403).json({
                message: "You are not authorized to edit this lecture"
            });
        }

        // Update lecture title
        if (lectureTitle !== undefined) {
            if (!lectureTitle.trim()) {
                return res.status(400).json({
                    message: "Lecture title cannot be empty"
                });
            }

            lecture.lectureTitle = lectureTitle.trim();
        }

        // Update free preview
        if (isPreviewFree !== undefined) {
            lecture.isPreviewFree =
                isPreviewFree === true ||
                isPreviewFree === "true";
        }

        // Upload new video if provided
        if (req.file) {
           const uploadedVideo = await uploadVideoOnCloudinary(
    req.file.path
);
            

            if (!uploadedVideo) {
                return res.status(500).json({
                    message: "Lecture video upload failed"
                });
            }

            lecture.videoUrl = uploadedVideo;
        }

        // Save lecture
        await lecture.save();

        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture
        });

    } catch (error) {
        console.error("Edit lecture error:", error);

        return res.status(500).json({
            message: "Failed to edit lecture",
            error: error.message
        });
    }
};




export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        const course = await Course.findOne({
            lectures: lectureId,
            creator: req.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Lecture not found or unauthorized"
            });
        }

        await Lecture.findByIdAndDelete(lectureId);

        course.lectures.pull(lectureId);
        await course.save();

        return res.status(200).json({
            message: "Lecture removed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to remove lecture",
            error: error.message
        });
    }
};


// get Creator
 
export const getCreatorById = async (req,res) => {
    try {
        const {userId} = req.body

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User is not Found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Failed to get Creator ${error}`})
    }
    
}