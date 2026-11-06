// =================== NotesPage.jsx ===================
import React, { useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { FaArrowLeftLong, FaBookOpen, FaRotate } from "react-icons/fa6"
import ai from "../assets/ai.png"

export function NotesPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { courseData } = useSelector(state => state.course)
    const course = courseData?.find(c => c._id === courseId)

    const [selectedLecture, setSelectedLecture] = useState(null)
    const [notes, setNotes] = useState(null)
    const [loading, setLoading] = useState(false)

    const generateNotes = async (lecture) => {
        setSelectedLecture(lecture)
        setLoading(true)
        setNotes(null)
        try {
            const result = await axios.post(serverUrl + "/api/ai/notes", {
                lectureTitle: lecture.lectureTitle,
                courseTitle: course?.title,
                category: course?.category
            }, { withCredentials: true })
            setNotes(result.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex" }}>

            {/* Sidebar */}
            <div style={{ width: 280, flexShrink: 0, background: "var(--bg-card)", borderRight: "1px solid var(--border)", padding: "24px 16px", overflow: "y-auto" }}>
                <button onClick={() => navigate(`/viewlecture/${courseId}`)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 13, marginBottom: 20 }}>
                    <FaArrowLeftLong /> Back
                </button>
                <div className="section-label" style={{ marginBottom: 12 }}>Select Lecture</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {course?.lectures?.map((lec, i) => (
                        <button key={lec._id} onClick={() => generateNotes(lec)} style={{
                            textAlign: "left", padding: "10px 12px", borderRadius: 10,
                            border: `1px solid ${selectedLecture?._id === lec._id ? "var(--accent)" : "var(--border)"}`,
                            background: selectedLecture?._id === lec._id ? "rgba(108,99,255,0.08)" : "transparent",
                            cursor: "pointer", fontSize: 13,
                            color: selectedLecture?._id === lec._id ? "var(--accent)" : "var(--text-secondary)",
                            fontWeight: selectedLecture?._id === lec._id ? 600 : 400, transition: "all 0.2s"
                        }}>
                            <span style={{ color: "var(--text-muted)", fontSize: 11, marginRight: 6 }}>{i + 1}.</span>
                            {lec.lectureTitle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "40px 32px", overflow: "auto" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={ai} style={{ width: 26, height: 26, borderRadius: "50%" }} alt="" />
                    </div>
                    <div>
                        <div className="section-label" style={{ marginBottom: 2 }}>AI Generated</div>
                        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Smart Notes</h1>
                    </div>
                    {notes && !loading && (
                        <button className="btn-outline" style={{ marginLeft: "auto", gap: 8, fontSize: 13 }} onClick={() => generateNotes(selectedLecture)}>
                            <FaRotate size={12} /> Regenerate
                        </button>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                        <ClipLoader size={40} color="var(--accent)" />
                        <p style={{ marginTop: 16 }}>Generating notes for "{selectedLecture?.lectureTitle}"...</p>
                    </div>
                )}

                {/* Empty */}
                {!notes && !loading && (
                    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
                        <FaBookOpen size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>Select a lecture</h3>
                        <p style={{ fontSize: 14 }}>Choose any lecture from the sidebar to generate AI-powered notes</p>
                    </div>
                )}

                {/* Notes Content */}
                {notes && !loading && (
                    <div className="animate-fade-up" style={{ maxWidth: 700 }}>

                        {/* Title + Summary */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
                            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>{notes.title}</h2>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{notes.summary}</p>
                        </div>

                        {/* Key Points */}
                        {notes.keyPoints?.length > 0 && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 14 }}>🎯 Key Points</div>
                                {notes.keyPoints.map((kp, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: i < notes.keyPoints.length - 1 ? "1px solid var(--border)" : "none" }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{kp.point}</div>
                                            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{kp.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Important Terms */}
                        {notes.importantTerms?.length > 0 && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 14 }}>📖 Important Terms</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                                    {notes.importantTerms.map((t, i) => (
                                        <div key={i} style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--border)" }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{t.term}</div>
                                            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t.definition}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practice Questions */}
                        {notes.practiceQuestions?.length > 0 && (
                            <div style={{ background: "rgba(108,99,255,0.05)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 14 }}>🧠 Practice Questions</div>
                                {notes.practiceQuestions.map((q, i) => (
                                    <div key={i} style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
                                        <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>Q{i + 1}.</span> {q}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quick Tips */}
                        {notes.quickTips?.length > 0 && (
                            <div style={{ background: "rgba(67,233,123,0.05)", border: "1px solid rgba(67,233,123,0.2)", borderRadius: 16, padding: "22px 24px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#16a34a", textTransform: "uppercase", marginBottom: 14 }}>💡 Quick Tips</div>
                                {notes.quickTips.map((tip, i) => (
                                    <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "flex", gap: 8, lineHeight: 1.5 }}>
                                        <span style={{ color: "#16a34a", flexShrink: 0 }}>✓</span> {tip}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotesPage
