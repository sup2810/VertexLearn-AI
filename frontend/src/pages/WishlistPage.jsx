import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { FaArrowLeftLong, FaHeart, FaTrash } from "react-icons/fa6"
import { FaStar } from "react-icons/fa6"
import Nav from "../component/Nav"

function WishlistPage() {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/features/wishlist", { withCredentials: true })
                setWishlist(result.data)
            } catch (e) {}
            finally { setLoading(false) }
        }
        fetchWishlist()
    }, [])

    const removeFromWishlist = async (courseId) => {
        setRemoving(courseId)
        try {
            await axios.post(serverUrl + "/api/features/wishlist/toggle", { courseId }, { withCredentials: true })
            setWishlist(prev => prev.filter(c => c._id !== courseId))
        } catch (e) {}
        finally { setRemoving(null) }
    }

    const calculateAvgRating = (reviews) => {
        if (!reviews?.length) return 0
        return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            <Nav />
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 24px 60px" }}>

                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Saved</div>
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                        <FaHeart style={{ color: "#ef4444", fontSize: 26 }} /> My Wishlist
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
                        {wishlist.length > 0 ? `${wishlist.length} saved course${wishlist.length > 1 ? "s" : ""}` : "No saved courses yet"}
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px" }}>
                        <ClipLoader size={40} color="var(--accent)" />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
                        <FaHeart size={56} style={{ marginBottom: 16, opacity: 0.2, color: "#ef4444" }} />
                        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>Nothing saved yet</h3>
                        <p style={{ marginBottom: 24 }}>Browse courses and click the ♡ to save them here</p>
                        <button className="btn-primary" style={{ justifyContent: "center" }} onClick={() => navigate("/allcourses")}>Browse Courses</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                        {wishlist.map(course => (
                            <div key={course._id} className="course-card" style={{ position: "relative" }}>
                                {/* Remove button */}
                                <button onClick={(e) => { e.stopPropagation(); removeFromWishlist(course._id) }} style={{
                                    position: "absolute", top: 12, right: 12, zIndex: 2,
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s", color: "#ef4444"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                >
                                    {removing === course._id ? <ClipLoader size={12} color="#ef4444" /> : <FaTrash size={12} />}
                                </button>

                                {/* Thumbnail */}
                                <div style={{ height: 180, overflow: "hidden", cursor: "pointer" }} onClick={() => navigate(`/viewcourse/${course._id}`)}>
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📚</div>
                                    )}
                                </div>

                                <div style={{ padding: "16px 18px 18px", cursor: "pointer" }} onClick={() => navigate(`/viewcourse/${course._id}`)}>
                                    <span className="badge" style={{ marginBottom: 10, display: "inline-flex" }}>{course.category}</span>
                                    <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.title}</h3>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                                        <span className="price-badge">{course.price ? `₹${course.price}` : "Free"}</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>
                                            <FaStar style={{ color: "#f59e0b" }} size={12} />
                                            {calculateAvgRating(course.reviews)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
