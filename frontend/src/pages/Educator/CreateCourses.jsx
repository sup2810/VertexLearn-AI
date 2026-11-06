import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const CATEGORIES = ["App Development", "AI/ML", "AI Tools", "Data Science", "Data Analytics", "Ethical Hacking", "UI UX Designing", "Web Development", "Others"];

function CreateCourses() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true });
      navigate("/courses");
      toast.success("Course Created");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 480, background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)", padding: "40px 36px" }}>

        <button onClick={() => navigate("/courses")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
          <FaArrowLeftLong /> My Courses
        </button>

        <div className="section-label" style={{ marginBottom: 8 }}>Educator</div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Create New Course</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>Start with a title and category — you can fill in details later</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Course Title</label>
            <input className="ev-input" type="text" placeholder="e.g. Complete Web Development Bootcamp" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateCourse()} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Category</label>
            <select className="ev-input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ cursor: "pointer" }}>
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate("/courses")}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading} onClick={handleCreateCourse}>
              {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourses;
