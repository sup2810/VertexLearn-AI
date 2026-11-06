// ProgressComponents.jsx — WishlistButton + ProgressBar + MarkCompleteButton
import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { FaHeart, FaTrophy, FaDownload, FaCircleCheck } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"

// =================== WishlistButton ===================
export function WishlistButton({ courseId, style = {} }) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const check = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/features/wishlist", { withCredentials: true })
                const ids = result.data.map(c => c._id?.toString())
                setIsWishlisted(ids.includes(courseId?.toString()))
            } catch (e) {}
        }
        if (courseId) check()
    }, [courseId])

    const toggle = async (e) => {
        e.stopPropagation()
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/features/wishlist/toggle", { courseId }, { withCredentials: true })
            setIsWishlisted(result.data.added)
        } catch (e) {}
        finally { setLoading(false) }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isWishlisted ? "rgba(239,68,68,0.1)" : "var(--bg-secondary)",
                border: `1px solid ${isWishlisted ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s", color: isWishlisted ? "#ef4444" : "var(--text-muted)",
                ...style
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.15)"
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = isWishlisted ? "rgba(239,68,68,0.1)" : "var(--bg-secondary)"
                e.currentTarget.style.borderColor = isWishlisted ? "rgba(239,68,68,0.3)" : "var(--border)"
            }}
        >
            <FaHeart size={15} style={{ transition: "transform 0.2s", transform: isWishlisted ? "scale(1.1)" : "scale(1)" }} />
        </button>
    )
}

// =================== ProgressBar ===================
export function ProgressBar({ courseId }) {
    const [progress, setProgress] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/features/progress/${courseId}`, { withCredentials: true })
                setProgress(result.data)
            } catch (e) {}
        }
        if (courseId) fetchProgress()
    }, [courseId])

    if (!progress) return null

    return (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Course Progress — {progress.completedCount}/{progress.totalLectures} lectures
                </span>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: progress.percentage === 100 ? "#16a34a" : "var(--accent)" }}>
                    {progress.percentage}%
                </span>
            </div>
            <div style={{ height: 8, background: "var(--bg-secondary)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                    height: "100%", width: `${progress.percentage}%`,
                    background: progress.percentage === 100
                        ? "linear-gradient(90deg, #43e97b, #38f9d7)"
                        : "linear-gradient(90deg, var(--accent), #a78bfa)",
                    borderRadius: 100, transition: "width 0.5s ease"
                }} />
            </div>
            {progress.isCompleted && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                        <FaTrophy size={14} /> Course Completed! 🎉
                    </div>
                    <button
                        onClick={() => window.open(`${serverUrl}/api/features/certificate/${courseId}`, "_blank")}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
                            background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)",
                            color: "#16a34a", cursor: "pointer", fontSize: 12, fontWeight: 600
                        }}
                    >
                        <FaDownload size={11} /> Download Certificate
                    </button>
                </div>
            )}
        </div>
    )
}

// =================== MarkCompleteButton ===================
export function MarkCompleteButton({ courseId, lectureId, completedLectures = [], onComplete }) {
    const [loading, setLoading] = useState(false)
    const isCompleted = completedLectures.map(id => id?.toString()).includes(lectureId?.toString())

    const markComplete = async (e) => {
        e.stopPropagation()
        if (isCompleted) return
        setLoading(true)
        try {
            const result = await axios.post(
                serverUrl + "/api/features/progress/mark",
                { courseId, lectureId },
                { withCredentials: true }
            )
            onComplete?.(result.data)
        } catch (e) {}
        finally { setLoading(false) }
    }

    return (
        <button
            onClick={markComplete}
            disabled={isCompleted || loading}
            style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 8, border: `1px solid ${isCompleted ? "rgba(67,233,123,0.4)" : "var(--border)"}`,
                background: isCompleted ? "rgba(67,233,123,0.1)" : "var(--bg-secondary)",
                color: isCompleted ? "#16a34a" : "var(--text-secondary)", fontSize: 12, fontWeight: 600,
                cursor: isCompleted ? "default" : "pointer", transition: "all 0.2s"
            }}
        >
            <FaCircleCheck size={13} style={{ color: isCompleted ? "#16a34a" : "var(--border-hover)" }} />
            {isCompleted ? "Completed" : loading ? "Saving..." : "Mark Complete"}
        </button>
    )
}
