import React, { useState } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { FaArrowLeftLong, FaTrophy, FaRotate } from "react-icons/fa6"
import ai from "../assets/ai.png"

function QuizPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { courseData } = useSelector(state => state.course)
    const course = courseData?.find(c => c._id === courseId)

    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(false)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    const generateQuiz = async () => {
        setLoading(true)
        setAnswers({})
        setSubmitted(false)
        setQuiz(null)
        try {
            const result = await axios.post(serverUrl + "/api/ai/quiz", {
                courseTitle: course?.title,
                category: course?.category,
                level: course?.level
            }, { withCredentials: true })
            setQuiz(result.data.quiz)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (qIndex, optIndex) => {
        if (submitted) return
        setAnswers(prev => ({ ...prev, [qIndex]: optIndex }))
    }

    const handleSubmit = () => {
        let correct = 0
        quiz.forEach((q, i) => {
            if (answers[i] === q.correct) correct++
        })
        setScore(correct)
        setSubmitted(true)
    }

    const allAnswered = quiz && Object.keys(answers).length === quiz.length

    const scoreColor = score >= 4 ? "#16a34a" : score >= 3 ? "#d97706" : "#dc2626"
    const scoreMsg = score >= 4 ? "Excellent! 🎉" : score >= 3 ? "Good Job! 👍" : "Keep Practicing! 💪"

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 60px" }}>

                {/* Header */}
                <button onClick={() => navigate(`/viewlecture/${courseId}`)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                    <FaArrowLeftLong /> Back to Course
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={ai} style={{ width: 28, height: 28, borderRadius: "50%" }} alt="" />
                    </div>
                    <div>
                        <div className="section-label" style={{ marginBottom: 4 }}>AI Generated</div>
                        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>Course Quiz</h1>
                    </div>
                </div>

                {/* Course info */}
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}>{course?.title}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{course?.category} · {course?.level}</div>
                    </div>
                    <button className="btn-primary" style={{ gap: 8 }} onClick={generateQuiz} disabled={loading}>
                        {loading ? <ClipLoader size={18} color="var(--bg-primary)" /> : <><FaRotate size={13} /> {quiz ? "Regenerate Quiz" : "Generate Quiz"}</>}
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                        <ClipLoader size={40} color="var(--accent)" />
                        <p style={{ marginTop: 16, fontSize: 15 }}>AI is generating your quiz...</p>
                    </div>
                )}

                {/* Score Result */}
                {submitted && (
                    <div className="animate-scale-in" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px", marginBottom: 24, textAlign: "center", boxShadow: "var(--shadow-hover)" }}>
                        <FaTrophy size={40} style={{ color: scoreColor, marginBottom: 12 }} />
                        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>{scoreMsg}</h2>
                        <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 4 }}>You scored <span style={{ color: scoreColor, fontWeight: 700, fontSize: 28, fontFamily: "Syne, sans-serif" }}>{score}/{quiz.length}</span></p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>{Math.round((score / quiz.length) * 100)}% correct</p>
                        <button className="btn-outline" style={{ justifyContent: "center", gap: 8 }} onClick={generateQuiz}>
                            <FaRotate size={13} /> Try New Quiz
                        </button>
                    </div>
                )}

                {/* Questions */}
                {quiz && !loading && quiz.map((q, i) => {
                    const userAnswer = answers[i]
                    const isCorrect = submitted && userAnswer === q.correct
                    const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correct

                    return (
                        <div key={i} className="animate-fade-up" style={{ background: "var(--bg-card)", border: `1px solid ${submitted ? (isCorrect ? "rgba(67,233,123,0.4)" : isWrong ? "rgba(255,107,107,0.4)" : "var(--border)") : "var(--border)"}`, borderRadius: 16, padding: "20px 22px", marginBottom: 16, transition: "border-color 0.3s" }}>
                            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)", flexShrink: 0, border: "1px solid var(--border)" }}>{i + 1}</span>
                                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5, paddingTop: 3 }}>{q.question}</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {q.options.map((opt, j) => {
                                    const isSelected = userAnswer === j
                                    const isCorrectOpt = j === q.correct
                                    let bg = "var(--bg-secondary)", border = "var(--border)", color = "var(--text-secondary)"

                                    if (submitted) {
                                        if (isCorrectOpt) { bg = "rgba(67,233,123,0.12)"; border = "rgba(67,233,123,0.5)"; color = "#16a34a" }
                                        else if (isSelected && !isCorrectOpt) { bg = "rgba(255,107,107,0.12)"; border = "rgba(255,107,107,0.5)"; color = "#dc2626" }
                                    } else if (isSelected) {
                                        bg = "rgba(108,99,255,0.1)"; border = "var(--accent)"; color = "var(--accent)"
                                    }

                                    return (
                                        <button key={j} onClick={() => handleAnswer(i, j)} style={{
                                            textAlign: "left", padding: "10px 14px", borderRadius: 10,
                                            background: bg, border: `1px solid ${border}`, cursor: submitted ? "default" : "pointer",
                                            fontSize: 14, color, fontWeight: isSelected || (submitted && isCorrectOpt) ? 600 : 400,
                                            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10
                                        }}>
                                            <span style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color, background: isSelected || (submitted && isCorrectOpt) ? border : "transparent" }}>
                                                {String.fromCharCode(65 + j)}
                                            </span>
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Explanation after submit */}
                            {submitted && q.explanation && (
                                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(108,99,255,0.06)", borderRadius: 10, border: "1px solid rgba(108,99,255,0.15)" }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>💡 EXPLANATION  </span>
                                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{q.explanation}</span>
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Submit button */}
                {quiz && !loading && !submitted && (
                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", height: 48, marginTop: 8 }} disabled={!allAnswered} onClick={handleSubmit}>
                        Submit Quiz ({Object.keys(answers).length}/{quiz?.length} answered)
                    </button>
                )}

                {/* Empty state */}
                {!quiz && !loading && (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
                        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>Test Your Knowledge</h3>
                        <p style={{ fontSize: 15, marginBottom: 24 }}>Click "Generate Quiz" to create an AI-powered quiz for this course</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuizPage
