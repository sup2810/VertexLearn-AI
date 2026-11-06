import React, { useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { FaArrowLeftLong, FaRoad, FaFlag, FaLightbulb } from "react-icons/fa6"
import ai from "../assets/ai.png"
import Nav from "../component/Nav"

function RoadmapPage() {
    const navigate = useNavigate()
    const [goal, setGoal] = useState("")
    const [currentLevel, setCurrentLevel] = useState("Beginner")
    const [timeAvailable, setTimeAvailable] = useState("1-2 hours/day")
    const [roadmap, setRoadmap] = useState(null)
    const [loading, setLoading] = useState(false)

    const generateRoadmap = async () => {
        if (!goal.trim()) return
        setLoading(true)
        setRoadmap(null)
        try {
            const result = await axios.post(serverUrl + "/api/ai/roadmap", {
                goal, currentLevel, timeAvailable
            }, { withCredentials: true })
            setRoadmap(result.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const phaseColors = ["#6c63ff", "#43e97b", "#ff6b6b", "#f59e0b", "#06b6d4"]

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            <Nav />
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 24px 60px" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <FaRoad size={28} style={{ color: "var(--accent)" }} />
                    </div>
                    <div className="section-label" style={{ marginBottom: 8 }}>AI Powered</div>
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Learning Roadmap</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Tell AI what you want to learn — get a personalized step-by-step roadmap</p>
                </div>

                {/* Input Card */}
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 28px 24px", marginBottom: 32, boxShadow: "var(--shadow)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>What do you want to learn?</label>
                            <input className="ev-input" placeholder="e.g. I want to become a full-stack developer and get a job" value={goal} onChange={e => setGoal(e.target.value)} onKeyDown={e => e.key === "Enter" && generateRoadmap()} style={{ fontSize: 15 }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Current Level</label>
                                <select className="ev-input" value={currentLevel} onChange={e => setCurrentLevel(e.target.value)} style={{ cursor: "pointer" }}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Time Available</label>
                                <select className="ev-input" value={timeAvailable} onChange={e => setTimeAvailable(e.target.value)} style={{ cursor: "pointer" }}>
                                    <option>30 mins/day</option>
                                    <option>1-2 hours/day</option>
                                    <option>3-4 hours/day</option>
                                    <option>Full-time</option>
                                </select>
                            </div>
                        </div>

                        <button className="btn-primary" style={{ justifyContent: "center", height: 48, gap: 10 }} onClick={generateRoadmap} disabled={loading}>
                            {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : <><img src={ai} style={{ width: 20, height: 20, borderRadius: "50%" }} alt="" /> Generate My Roadmap</>}
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        <ClipLoader size={40} color="var(--accent)" />
                        <p style={{ marginTop: 16 }}>Creating your personalized roadmap...</p>
                    </div>
                )}

                {/* Roadmap Result */}
                {roadmap && !loading && (
                    <div className="animate-fade-up">
                        {/* Title */}
                        <div style={{ background: "var(--text-primary)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div>
                                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "var(--bg-primary)", marginBottom: 4 }}>{roadmap.title}</h2>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>⏱ {roadmap.totalDuration}</span>
                            </div>
                            <span style={{ padding: "6px 14px", background: "rgba(108,99,255,0.3)", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{roadmap.phases?.length} Phases</span>
                        </div>

                        {/* Phases */}
                        <div style={{ position: "relative" }}>
                            {/* Vertical line */}
                            <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "var(--border)" }} />

                            {roadmap.phases?.map((phase, i) => (
                                <div key={i} style={{ position: "relative", paddingLeft: 52, marginBottom: 20 }}>
                                    {/* Phase number circle */}
                                    <div style={{ position: "absolute", left: 8, top: 20, width: 26, height: 26, borderRadius: "50%", background: phaseColors[i % phaseColors.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", zIndex: 1 }}>
                                        {phase.phase}
                                    </div>

                                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px", borderLeft: `3px solid ${phaseColors[i % phaseColors.length]}` }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{phase.title}</h3>
                                            <span style={{ padding: "3px 10px", background: "var(--bg-secondary)", borderRadius: 100, fontSize: 11, fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>⏱ {phase.duration}</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>{phase.description}</p>

                                        {/* Topics */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                            {phase.topics?.map((topic, j) => (
                                                <span key={j} style={{ padding: "4px 10px", background: `${phaseColors[i % phaseColors.length]}15`, border: `1px solid ${phaseColors[i % phaseColors.length]}30`, borderRadius: 100, fontSize: 12, color: phaseColors[i % phaseColors.length], fontWeight: 500 }}>
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Recommended Courses */}
                                        {phase.recommendedCourses?.length > 0 && (
                                            <div style={{ padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 6 }}>📚 RECOMMENDED COURSES</div>
                                                {phase.recommendedCourses.map((course, j) => (
                                                    <div key={j} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{ color: "var(--accent)", fontSize: 10 }}>▸</span> {course}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tips */}
                        {roadmap.tips?.length > 0 && (
                            <div style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 16, padding: "20px 22px", marginTop: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                    <FaLightbulb style={{ color: "var(--accent)" }} />
                                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Pro Tips</span>
                                </div>
                                {roadmap.tips.map((tip, i) => (
                                    <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
                                        <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {tip}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ textAlign: "center", marginTop: 24 }}>
                            <button className="btn-outline" onClick={() => navigate("/allcourses")} style={{ justifyContent: "center" }}>Browse Courses to Start 🚀</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoadmapPage
