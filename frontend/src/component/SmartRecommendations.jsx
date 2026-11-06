// =================== SmartRecommendations.jsx ===================
import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import ai from "../assets/ai.png"

export function SmartRecommendations() {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/ai/recommendations", { withCredentials: true })
                setRecommendations(result.data.recommendations || [])
            } catch (e) {}
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    if (loading) return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <ClipLoader size={24} color="var(--accent)" />
        </div>
    )

    if (recommendations.length === 0) return null

    return (
        <div style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <img src={ai} style={{ width: 24, height: 24, borderRadius: "50%" }} alt="" />
                <div className="section-label">AI Picks For You</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {recommendations.map((course) => (
                    <div key={course._id} className="course-card" onClick={() => navigate(`/viewcourse/${course._id}`)}>
                        <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📚</div>
                            )}
                            <div style={{ position: "absolute", top: 10, left: 10 }}>
                                <span className="badge" style={{ background: "rgba(108,99,255,0.9)", color: "white", border: "none", fontSize: 11, backdropFilter: "blur(8px)" }}>AI Pick ✨</span>
                            </div>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.title}</h3>
                            <p style={{ fontSize: 12, color: "var(--accent)", lineHeight: 1.5, marginBottom: 8 }}>💡 {course.reason}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span className="price-badge" style={{ fontSize: 15 }}>{course.price ? `₹${course.price}` : "Free"}</span>
                                <span className="badge" style={{ fontSize: 11 }}>{course.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SmartRecommendations
