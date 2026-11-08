
import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function CreateCourses() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter course title");
      return;
    }

    if (!category) {
      toast.error("Please select course category");
      return;
    }

    if (!isFree && (!price || Number(price) <= 0)) {
      toast.error("Please enter a valid course price");
      return;
    }

    try {
      setLoading(true);

      // Send all course details in one request
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("subTitle", subTitle.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", isFree ? "0" : price);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const result = await axios.post(
        `${serverUrl}/api/course/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      const courseId =
        result.data.course?._id || result.data._id;

      if (!courseId) {
        throw new Error("Course ID was not returned");
      }

      toast.success("Course created successfully!");

      navigate(`/editcourse/${courseId}`);
    } catch (error) {
      console.error("Create course error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 650,
          background: "var(--bg-card)",
          borderRadius: 24,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          padding: "40px 36px",
        }}
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/courses")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          <FaArrowLeftLong />
          My Courses
        </button>

        {/* Heading */}
        <div className="section-label" style={{ marginBottom: 8 }}>
          Educator
        </div>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Create New Course
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          Enter all your course details below.
        </p>

        {/* Course Form */}
        <form
          onSubmit={handleCreateCourse}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Course Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Title *
            </label>

            <input
              className="ev-input"
              type="text"
              placeholder="e.g. Complete Web Development Bootcamp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Course Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Subtitle
            </label>

            <input
              className="ev-input"
              type="text"
              placeholder="A short introduction to your course"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          {/* Course Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Description
            </label>

            <textarea
              className="ev-input"
              placeholder="Explain what students will learn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Course Thumbnail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Thumbnail / Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbnail(e.target.files?.[0] || null)
              }
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
              }}
            />

            {thumbnail && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Course thumbnail preview"
                  style={{
                    width: 180,
                    height: 110,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                />

                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                  {thumbnail.name}
                </p>
              </div>
            )}
          </div>

          {/* Course Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Category *
            </label>

            <select
              className="ev-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ cursor: "pointer" }}
            >
              <option value="">Select Category</option>

              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Course Level */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Level
            </label>

            <select
              className="ev-input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Free or Paid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Course Type
            </label>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-secondary)" }}>
                <input
                  type="radio"
                  checked={isFree}
                  onChange={() => setIsFree(true)}
                />
                Free Course
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-secondary)" }}>
                <input
                  type="radio"
                  checked={!isFree}
                  onChange={() => setIsFree(false)}
                />
                Paid Course
              </label>
            </div>

            {!isFree && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Course Price (₹) *
                </label>

                <input
                  className="ev-input"
                  type="number"
                  min="1"
                  placeholder="Enter course price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            )}

            {isFree && (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Students can access this course for free.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button
              type="button"
              className="btn-outline"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => navigate("/courses")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="var(--bg-primary)" />
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourses;
