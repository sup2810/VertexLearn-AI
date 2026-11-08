
import React, { useEffect, useState } from "react";
import Nav from "../../component/Nav.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App.jsx";
import { toast } from "react-toastify";

function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch educator courses
  const fetchCourses = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcreator`,
        { withCredentials: true }
      );

      setCourses(result.data || []);
    } catch (error) {
      console.error("Fetch courses error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course and its lectures?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(courseId);

      await axios.delete(
        `${serverUrl}/api/course/remove/${courseId}`,
        { withCredentials: true }
      );

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );

      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Delete course error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete course"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <Nav />

      <main
        style={{
          padding: "110px 24px 48px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>
              Educator Dashboard
            </div>

            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              My Courses
            </h1>

            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Manage your courses, lectures, and publishing status.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/createcourse")}
          >
            + Create Course
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <p style={{ color: "var(--text-muted)" }}>
              Loading your courses...
            </p>
          </div>
        ) : courses.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              border: "1px solid var(--border)",
              borderRadius: 16,
              background: "var(--bg-secondary)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>

            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              No courses yet
            </h2>

            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
              Create your first course and start teaching.
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate("/createcourse")}
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          /* Course grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {courses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "var(--bg-secondary)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 180,
                    background: "var(--bg-tertiary)",
                    overflow: "hidden",
                  }}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                      }}
                    >
                      📘
                    </div>
                  )}
                </div>

                {/* Course info */}
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      {course.category}
                    </span>

                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: course.isPublished
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(245,158,11,0.12)",
                        color: course.isPublished
                          ? "#16a34a"
                          : "#d97706",
                      }}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {course.title}
                  </h3>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {course.lectures?.length || 0} lectures
                  </p>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() =>
                        navigate(`/editcourse/${course._id}`)
                      }
                    >
                      Edit Course
                    </button>

                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #ef4444",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {deletingId === course._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Courses;
