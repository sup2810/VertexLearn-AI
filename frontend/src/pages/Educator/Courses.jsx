// =================== Courses.jsx ===================
import React, { useEffect } from "react";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import axios from "axios";
import { setCreatorCourseData } from "../../redux/courseSlice";
import Nav from "../../component/Nav";
import img from "../../assets/empty.jpg";

export function Courses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  useEffect(() => {
    const creatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true });
        dispatch(setCreatorCourseData(result.data));
      } catch (e) {}
    };
    creatorCourses();
  }, [userData]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 24px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <button onClick={() => navigate("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>
              <FaArrowLeftLong /> Dashboard
            </button>
            <div className="section-label" style={{ marginBottom: 6 }}>Educator</div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>My Courses</h1>
          </div>
          <button className="btn-primary" style={{ gap: 8 }} onClick={() => navigate("/createcourse")}>
            <FaPlus size={14} /> Create Course
          </button>
        </div>

        {/* Table */}
        {creatorCourseData?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>No courses yet</h3>
            <p style={{ marginBottom: 24 }}>Create your first course to get started</p>
            <button className="btn-primary" style={{ justifyContent: "center" }} onClick={() => navigate("/createcourse")}>Create Course</button>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                  {["Course", "Price", "Status", "Action"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {creatorCourseData?.map((course) => (
                  <tr key={course._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                      <img src={course.thumbnail || img} style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)", flexShrink: 0 }} alt="" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{course.title}</span>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}>
                      {course.price ? `₹${course.price}` : <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: course.isPublished ? "rgba(67,233,123,0.12)" : "rgba(255,107,107,0.12)", color: course.isPublished ? "#16a34a" : "#dc2626" }}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <button onClick={() => navigate(`/editcourse/${course._id}`)} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                        <FaEdit size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "12px 20px", fontSize: 13, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
              {creatorCourseData?.length} course{creatorCourseData?.length !== 1 ? "s" : ""} total
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
