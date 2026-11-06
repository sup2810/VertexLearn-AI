import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { serverUrl } from "../App"
import { ClipLoader } from "react-spinners"
import ai from "../assets/ai.png"

function DoubtSolver({ courseTitle, lectureTitle }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: `Hi! I'm your AI tutor for **${lectureTitle || courseTitle}**. Ask me anything about this lecture! 🎓` }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendDoubt = async () => {
        if (!input.trim()) return
        const userMsg = { role: "user", content: input }
        const updatedMsgs = [...messages, userMsg]
        setMessages(updatedMsgs)
        setInput("")
        setLoading(true)

        try {
            const chatHistory = updatedMsgs.slice(1) // exclude greeting
            const result = await axios.post(serverUrl + "/api/ai/doubt", {
                doubt: input,
                courseTitle,
                lectureTitle,
                chatHistory: chatHistory.slice(-6) // last 6 messages for context
            }, { withCredentials: true })

            setMessages(prev => [...prev, { role: "assistant", content: result.data.answer }])
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process your doubt. Please try again." }])
        } finally {
            setLoading(false)
        }
    }

    // Parse bold markdown in messages
    const parseText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>")
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(p => !p)}
                style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 999,
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--text-primary)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "var(--shadow-hover)", transition: "all 0.3s"
                }}
                title="AI Doubt Solver"
            >
                <img src={ai} style={{ width: 30, height: 30, borderRadius: "50%" }} alt="" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="animate-slide-down" style={{
                    position: "fixed", bottom: 92, right: 24, zIndex: 998,
                    width: 360, height: 480, background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: 20,
                    boxShadow: "var(--shadow-hover)", display: "flex", flexDirection: "column",
                    overflow: "hidden"
                }}>
                    {/* Header */}
                    <div style={{ padding: "14px 18px", background: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={ai} style={{ width: 28, height: 28, borderRadius: "50%" }} alt="" />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--bg-primary)", fontFamily: "Syne, sans-serif" }}>AI Doubt Solver</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Powered by Gemini 2.5 Flash</div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, scrollbarWidth: "thin" }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    maxWidth: "85%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    background: msg.role === "user" ? "var(--text-primary)" : "var(--bg-secondary)",
                                    color: msg.role === "user" ? "var(--bg-primary)" : "var(--text-primary)",
                                    fontSize: 13, lineHeight: 1.5,
                                    border: msg.role === "user" ? "none" : "1px solid var(--border)"
                                }}
                                    dangerouslySetInnerHTML={{ __html: parseText(msg.content) }}
                                />
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: "16px 16px 16px 4px", border: "1px solid var(--border)" }}>
                                    <ClipLoader size={14} color="var(--accent)" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                        <input
                            className="ev-input"
                            placeholder="Ask your doubt..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendDoubt()}
                            style={{ fontSize: 13, padding: "8px 12px" }}
                        />
                        <button onClick={sendDoubt} disabled={loading} style={{
                            width: 36, height: 36, borderRadius: 10, background: "var(--text-primary)",
                            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, fontSize: 16, color: "var(--bg-primary)"
                        }}>↑</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default DoubtSolver
