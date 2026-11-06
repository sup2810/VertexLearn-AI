import React, { useEffect, useState, useCallback } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setSelectedCourse } from '../redux/courseSlice'
import { FaStar } from "react-icons/fa6"
import { FaPlayCircle } from "react-icons/fa"
import { FaLock } from "react-icons/fa"
import axios from 'axios'
import { serverUrl } from '../App'
import Card from '../component/Card'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import img from "../assets/empty.jpg"
import { WishlistButton } from '../component/ProgressComponents'

function ViewCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const dispatch = useDispatch()

  const { courseData, selectedCourse } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)

  const [selectedLecture, setSelectedLecture] = useState(null)
  const [creatorData, setCreatorData] = useState(null)
  const [creatorCourses, setCreatorCourses] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchCourseData = useCallback(() => {
    const found = courseData?.find(course => course._id === courseId)
    if (found) dispatch(setSelectedCourse(found))
  }, [courseData, courseId, dispatch])

  useEffect(() => {
    fetchCourseData()
    const verify = userData?.enrolledCourses?.some(c =>
      (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
    )
    setIsEnrolled(!!verify)
  }, [courseData, courseId, userData, fetchCourseData])

  useEffect(() => {
    const handleCreator = async () => {
      if (!selectedCourse?.creator) return
      try {
        const result = await axios.post(
          serverUrl + "/api/course/creator",
          { userId: selectedCourse.creator },
          { withCredentials: true }
        )
        setCreatorData(result.data)
      } catch (error) {
        console.log("Creator fetch error:", error)
      }
    }
    handleCreator()
  }, [selectedCourse])

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const filtered = courseData.filter(
        course => course.creator === creatorData._id && course._id !== courseId
      )
      setCreatorCourses(filtered)
    }
  }, [creatorData, courseData, courseId])

  const handleEnroll = async () => {
    if (!userData?._id) {
      toast.error("Please login to enroll.")
      return
    }
    try {
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId: userData._id, courseId },
        { withCredentials: true }
      )
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: 'INR',
        name: "VIRTUAL COURSES",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              { ...response, courseId, userId: userData._id },
              { withCredentials: true }
            )
            setIsEnrolled(true)
            toast.success(verifyPayment.data.message)
          } catch (error) {
            toast.error(error?.response?.data?.message || "Payment verification failed.")
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error("Something went wrong while enrolling.")
    }
  }

  const handleReview = async () => {
    if (!rating) return toast.error("Please select a rating.")
    if (!comment.trim()) return toast.error("Please write a comment.")
    setLoading(true)
    try {
      await axios.post(
        serverUrl + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true }
      )
      toast.success("Review added successfully!")
      setRating(0)
      setComment("")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.")
    } finally {
      setLoading(false)
    }
  }

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const total = reviews.reduce((sum, r) => sum + r.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const avgRating = calculateAvgReview(selectedCourse?.reviews)
  const reviewCount = selectedCourse?.reviews?.length || 0

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Sticky Top Bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}
        >
          <FaArrowLeftLong /> Back
        </button>
        <span style={{ color: "var(--border)", fontSize: 16 }}>|</span>
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedCourse?.title}
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* ── Hero: Thumbnail + Info ── */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>

          {/* Thumbnail */}
          <div style={{ flex: "0 0 auto", width: "100%", maxWidth: 460 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-secondary)", aspectRatio: "16/9" }}>
              <img
                src={selectedCourse?.thumbnail || img}
                alt={selectedCourse?.title || "Course thumbnail"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Category + Level badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selectedCourse?.category && (
                <span style={{ padding: "4px 12px", borderRadius: 100, background: "var(--bg-secondary)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {selectedCourse.category}
                </span>
              )}
              {selectedCourse?.level && (
                <span style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", fontSize: 12, fontWeight: 600, color: "#6c63ff" }}>
                  {selectedCourse.level}
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
              {selectedCourse?.title}
            </h1>

            {selectedCourse?.subTitle && (
              <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
                {selectedCourse.subTitle}
              </p>
            )}

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaStar style={{ color: "#f59e0b", fontSize: 16 }} />
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>{avgRating}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>({reviewCount} Reviews)</span>
            </div>

            {/* ✅ Price + WishlistButton side by side */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
                ₹{selectedCourse?.price}
              </span>
              <WishlistButton courseId={courseId} />
            </div>

            {/* Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["10+ hours of video content", "Lifetime access to course materials"].map(h => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
                  <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span> {h}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  style={{
                    padding: "14px 32px", borderRadius: 12, border: "none",
                    background: "#1a1a2e", color: "#ffffff",
                    fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Enroll Now — ₹{selectedCourse?.price}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                  style={{
                    padding: "14px 32px", borderRadius: 12, border: "none",
                    background: "#16a34a", color: "#ffffff",
                    fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ▶ Watch Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── What You'll Learn + Who It's For ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            {
              title: "What You'll Learn",
              body: `Learn ${selectedCourse?.category || "this subject"} from the ground up with practical projects and real-world examples.`
            },
            {
              title: "Who This Course Is For",
              body: "Beginners, aspiring developers, and professionals looking to upgrade their skills."
            }
          ].map(({ title, body }) => (
            <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 0, marginBottom: 10 }}>{title}</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* ── Curriculum + Video Preview ── */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>

          {/* Curriculum */}
          <div style={{ flex: "0 0 auto", width: "100%", maxWidth: 340, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px" }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 0, marginBottom: 4 }}>
              Course Curriculum
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, marginTop: 0 }}>
              {selectedCourse?.lectures?.length || 0} Lectures
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {selectedCourse?.lectures?.map((lecture) => (
                <button
                  key={lecture._id}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => { if (lecture.isPreviewFree) setSelectedLecture(lecture) }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10,
                    border: `1px solid ${selectedLecture?._id === lecture._id ? "rgba(108,99,255,0.5)" : "var(--border)"}`,
                    background: selectedLecture?._id === lecture._id ? "rgba(108,99,255,0.08)" : "var(--bg-secondary)",
                    cursor: lecture.isPreviewFree ? "pointer" : "not-allowed",
                    opacity: lecture.isPreviewFree ? 1 : 0.55,
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ color: lecture.isPreviewFree ? "#6c63ff" : "var(--text-muted)", fontSize: 15, flexShrink: 0 }}>
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4 }}>
                    {lecture?.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div style={{ flex: 1, minWidth: 280, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px" }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 0, marginBottom: 16 }}>
              Free Preview
            </h2>
            <div style={{ background: "#000", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedLecture?.videoUrl ? (
                <video
                  key={selectedLecture._id}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  src={selectedLecture.videoUrl}
                  controls
                />
              ) : (
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center", padding: "0 24px" }}>
                  Select a free preview lecture to watch
                </span>
              )}
            </div>
            {selectedLecture && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10, marginBottom: 0 }}>
                Now playing: <strong style={{ color: "var(--text-primary)" }}>{selectedLecture.lectureTitle}</strong>
              </p>
            )}
          </div>
        </div>

        {/* ── Write a Review ── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 0, marginBottom: 16 }}>
            Write a Review
          </h2>

          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer", fontSize: 22, transition: "color 0.15s",
                  color: star <= rating ? "#f59e0b" : "var(--border)",
                }}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            rows={3}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1px solid var(--border)", borderRadius: 10,
              padding: "12px 14px", fontSize: 14,
              background: "var(--bg-secondary)", color: "var(--text-primary)",
              resize: "none", outline: "none", fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />

          <button
            onClick={handleReview}
            disabled={loading}
            style={{
              marginTop: 12, padding: "11px 28px", borderRadius: 10,
              border: "none", background: loading ? "var(--border)" : "#1a1a2e",
              color: "#ffffff", fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {loading ? <ClipLoader size={18} color="white" /> : "Submit Review"}
          </button>
        </div>

        {/* ── Creator Info ── */}
        {creatorData && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 40, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {creatorData?.photoUrl ? (
              <img
                src={creatorData.photoUrl}
                alt={creatorData.name}
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#6c63ff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
                {creatorData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 4 }}>Educator</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>{creatorData?.name}</h3>
              {creatorData?.description && <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 4px" }}>{creatorData.description}</p>}
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, wordBreak: "break-all" }}>{creatorData?.email}</p>
            </div>
          </div>
        )}

        {/* ── Other Courses by Creator ── */}
        {creatorCourses?.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20, marginTop: 0 }}>
              More by this Educator
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {creatorCourses.map((course) => (
                <Card
                  key={course._id}
                  thumbnail={course.thumbnail}
                  id={course._id}
                  price={course.price}
                  title={course.title}
                  category={course.category}
                  reviews={course.reviews}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewCourse
