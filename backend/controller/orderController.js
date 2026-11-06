import razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";
import crypto from "crypto";

const RazorPayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── BUG 1 FIX: console.log hata diya — key production logs mein expose hoti thi
// console.log(process.env.RAZORPAY_KEY_ID)  ← DELETED

export const RazorpayOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const options = {
      amount: course.price * 100, // paise mein
      currency: "INR",
      // ── BUG 2 FIX: receipt mein .toString() string ke andar tha
      // Pehle: `${courseId}.toString()` → literal string "ObjectId.toString()"
      // Ab:    courseId.toString()      → actual ID string
      receipt: courseId.toString(),
    };

    const order = await RazorPayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to create Razorpay Order: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ── BUG 3 FIX: userId client se nahi lena — isAuth middleware se lo
    // Pehle: const { userId } = req.body  ← attacker apna userId bhej sakta tha
    // Ab:    req.userId                   ← JWT token se verified userId
    const userId = req.userId;

    if (
      !courseId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // ── BUG 4 FIX: orderInfo.status check hata diya
    // Razorpay ka order status fetch karna unreliable hai
    // Industry standard: HMAC-SHA256 signature verify karo
    // Pehle: orderInfo.status === 'paid' — easily spoofable
    // Ab: cryptographic signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({
          message: "Invalid payment signature — payment verification failed",
        });
    }

    // ── Signature valid — enrollment karo ────────────────────────────
    const [user, course] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Duplicate enrollment check
    const alreadyEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId.toString(),
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    const alreadyStudent = course.enrolledStudents.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!alreadyStudent) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res
      .status(200)
      .json({ message: "Payment verified and enrollment successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Payment verification error: ${error.message}` });
  }
};
