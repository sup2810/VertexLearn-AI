import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import Nav from "../../component/Nav";
import { FaPlus, FaBookOpen, FaUsers, FaIndianRupeeSign } from "react-icons/fa6";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);

  const CourseProgressData = creatorCourseData?.map((course) => ({
    name: course.title?.slice(0, 12) + "...",
    lectures: course.lectures?.length || 0,
  })) || [];

  const EnrollData = creatorCourseData?.map((course) => ({
    name: course.title?.slice(0, 12) + "...",
    enrolled: course.enrolledStudents?.length || 0,
  })) || [];

  const totalEarning = creatorCourseData?.reduce((sum, course) => {
    return sum + (course.price || 0) * (course.enrolledStudents?.length || 0);
  }, 0) || 0;

  const totalStudents = creatorCourseData?.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0) || 0;
  const totalCourses = creatorCourseData?.length || 0;
  const publishedCourses = creatorCourseData?.filter((c) => c.isPublished).length || 0;

  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();

  const customTooltipStyle = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)", fontSize: 13 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 60px" }}>

        {/* Welcome Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", boxShadow: "var(--shadow)" }}>
          {userData?.photoUrl ? (
            <img src={userData.photoUrl} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border-hover)", flexShrink: 0 }} alt="" />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, fontFamily: "Syne, sans-serif", flexShrink: 0 }}>{avatarChar}</div>
          )}
          <div style={{ flex: 1 }}>
            <div className="section-label" style={{ marginBottom: 4 }}>Educator Dashboard</div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Welcome back, {userData?.name} 👋</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{userData?.description || "Start creating courses for your students"}</p>
          </div>
          <button className="btn-primary" style={{ gap: 8 }} onClick={() => navigate("/courses")}>
            <FaPlus size={14} /> Create Course
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: <FaBookOpen size={18} />, label: "Total Courses", value: totalCourses, sub: `${publishedCourses} published`, color: "#6c63ff" },
            { icon: <FaUsers size={18} />, label: "Total Students", value: totalStudents, sub: "enrolled", color: "#43e97b" },
            { icon: <FaIndianRupeeSign size={18} />, label: "Total Earnings", value: `₹${totalEarning.toLocaleString()}`, sub: "estimated revenue", color: "#ff6b6b" },
          ].map(({ icon, label, value, sub, color }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px", boxShadow: "var(--shadow)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { title: "Lectures per Course", data: CourseProgressData, key: "lectures", color: "var(--accent)" },
            { title: "Enrollment per Course", data: EnrollData, key: "enrolled", color: "#43e97b" },
          ].map(({ title, data, key, color }) => (
            <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", boxShadow: "var(--shadow)" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>{title}</h3>
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Bar dataKey={key} fill={color} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>No data yet</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
