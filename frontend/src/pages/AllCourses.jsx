import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import Card from "../component/Card";

const CATEGORIES = [
  "App Development",
  "AI/ML",
  "AI Tools",
  "Data Science",
  "Data Analytics",
  "Ethical Hacking",
  "UI UX Designing",
  "Web Development",
  "Others",
];

function AllCourses() {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleCategory = (val) => {
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  useEffect(() => {
    setFilterCourses(courseData);
  }, [courseData]);

  useEffect(() => {
    let copy = courseData?.slice() || [];
    if (category.length > 0) {
      copy = copy.filter((c) => category.includes(c.category));
    }
    setFilterCourses(copy);
  }, [category, courseData]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex" }}>
      <Nav />

      {/* Mobile Filter Toggle */}
      <button
        className="lg:hidden"
        onClick={() => setIsSidebarVisible((p) => !p)}
        style={{
          position: "fixed",
          top: 80,
          left: 16,
          zIndex: 40,
          background: "var(--text-primary)",
          color: "var(--bg-primary)",
          border: "none",
          borderRadius: 10,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "var(--shadow)",
        }}
      >
        {isSidebarVisible ? "✕ Filters" : "⚙ Filters"}
      </button>

      {/* Mobile Overlay */}
      {isSidebarVisible && (
        <div
          className="sidebar-overlay lg:hidden fixed inset-0 z-30"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`ev-sidebar fixed top-0 left-0 h-screen overflow-y-auto z-40 transition-transform duration-300
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ width: 260, paddingTop: 88 }}
      >
        <div style={{ padding: "0 20px 40px" }}>
          {/* AI Search */}
          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginBottom: 24, fontSize: 14 }}
            onClick={() => navigate("/search")}
          >
            <img src={ai} alt="" style={{ width: 20, height: 20, borderRadius: "50%" }} />
            Search with AI
          </button>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            Filter by Category
          </div>

          {/* Clear Filter */}
          {category.length > 0 && (
            <button
              onClick={() => setCategory([])}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                color: "var(--accent)",
                cursor: "pointer",
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              Clear all ({category.length})
            </button>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CATEGORIES.map((cat) => (
              <label
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: category.includes(cat) ? "rgba(108,99,255,0.08)" : "transparent",
                  border: `1px solid ${category.includes(cat) ? "var(--accent)" : "transparent"}`,
                  transition: "all 0.2s",
                  fontSize: 14,
                  color: category.includes(cat) ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: category.includes(cat) ? 600 : 400,
                }}
              >
                <input
                  type="checkbox"
                  className="ev-check"
                  checked={category.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 5,
                    border: `2px solid ${category.includes(cat) ? "var(--accent)" : "var(--border-hover)"}`,
                    background: category.includes(cat) ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "white",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {category.includes(cat) ? "✓" : ""}
                </span>
                {cat}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          paddingTop: 96,
          paddingLeft: 0,
          paddingRight: 24,
          paddingBottom: 48,
          marginLeft: 260,
        }}
        className="lg:ml-65 ml-0 px-4"
      >
        {/* Header */}
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>
            All Courses
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            {category.length > 0
              ? `${filterCourses?.length || 0} courses found`
              : `Explore ${courseData?.length || 0} courses`}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            {category.length > 0
              ? `Filtered by: ${category.join(", ")}`
              : "Discover courses that match your goals"}
          </p>
        </div>

        {/* Grid */}
        {filterCourses?.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {filterCourses.map((course, index) => (
              <div
                key={course._id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
              >
                <Card
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  reviews={course.reviews}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              No courses found
            </h3>
            <p style={{ fontSize: 15 }}>Try adjusting your filters or search with AI</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AllCourses;
