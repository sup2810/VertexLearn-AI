import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiMicAiFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import start from "../assets/start.mp3";
import ai from "../assets/ai.png";
import Nav from "../component/Nav";

function SearchWithAi() {
  const startSound = new Audio(start);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleVoiceSearch = async () => {
    if (!SpeechRecognition) return toast.error("Speech recognition not supported");
    const recognition = new SpeechRecognition();
    setListening(true);
    recognition.start();
    startSound.play();
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };
    recognition.onerror = () => { setListening(false); toast.error("Microphone error"); };
  };

  const handleRecommendation = async (query) => {
    if (!query) return;
    setLoading(true);
    setListening(false);
    try {
      const result = await axios.post(serverUrl + "/api/course/search", { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      setLoading(false);
      if (result.data.length > 0) speak("These are the top courses I found for you");
      else speak("No courses found");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "100px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
            <FaArrowLeftLong /> Back
          </button>
          <div className="section-label" style={{ marginBottom: 12 }}>AI Powered</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <img src={ai} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            Search with AI
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Describe what you want to learn — AI will find the best courses for you</p>
        </div>

        {/* Search Box */}
        <div style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow-hover)", padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            placeholder="e.g. I want to learn web development, AI/ML, cloud..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRecommendation(input)}
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: "var(--text-primary)", padding: "10px 0" }}
          />
          {input && (
            <button onClick={() => handleRecommendation(input)} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
              Search
            </button>
          )}
          <button
            onClick={handleVoiceSearch}
            title="Voice Search"
            style={{ width: 44, height: 44, borderRadius: 14, background: listening ? "var(--accent)" : "var(--text-primary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
          >
            <RiMicAiFill size={20} color="var(--bg-primary)" />
          </button>
        </div>

        {/* Listening indicator */}
        {listening && (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: "pulse-glow 1.2s infinite" }} />
            Listening...
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ marginTop: 40, color: "var(--text-muted)", fontSize: 15 }}>Finding best courses for you...</div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <div style={{ width: "100%", marginTop: 48 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>AI Results — {recommendations.length} found</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {recommendations.map((course) => (
                <div key={course._id} className="course-card" onClick={() => navigate(`/viewcourse/${course._id}`)}>
                  <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📚</div>
                    )}
                    <div style={{ position: "absolute", top: 10, left: 10 }}>
                      <span className="badge" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: "#333", border: "none", fontSize: 11 }}>{course.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.title}</h3>
                    <span className="price-badge">{course.price ? `₹${course.price}` : "Free"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !listening && recommendations.length === 0 && input && (
          <div style={{ marginTop: 60, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>No courses found. Try a different query.</p>
          </div>
        )}

        {/* Default state tips */}
        {!loading && !listening && recommendations.length === 0 && !input && (
          <div style={{ marginTop: 48, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["Web Development", "AI / ML", "Data Science", "UI UX Design", "Ethical Hacking"].map((tag) => (
              <button key={tag} onClick={() => { setInput(tag); handleRecommendation(tag); }} style={{ padding: "8px 16px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
