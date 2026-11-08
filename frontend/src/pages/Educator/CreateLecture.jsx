
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";

function CreateLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { lectureData } = useSelector((state) => state.lecture);

  // Fetch course lectures
  useEffect(() => {
    const getCourseLecture = async () => {
      setFetching(true);
      dispatch(setLectureData([]));

      try {
        const result = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );

        dispatch(setLectureData(result.data.lectures || []));
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load lectures"
        );
      } finally {
        setFetching(false);
      }
    };

    getCourseLecture();
  }, [courseId, dispatch]);

  // Create lecture
  const handleCreateLecture = async () => {
    const title = lectureTitle.trim();

    if (!title) {
      toast.error("Please enter a lecture title");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle: title },
        { withCredentials: true }
      );

      const newLecture = result.data.lecture;

      dispatch(setLectureData([...(lectureData || []), newLecture]));

      toast.success("Lecture added successfully");
      setLectureTitle("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create lecture"
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
          maxWidth: 580,
          background: "var(--bg-card)",
          borderRadius: 24,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          padding: "40px 36px",
        }}
      >
        <button
          onClick={() => navigate(`/editcourse/${courseId}`)}
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
          <FaArrowLeftLong /> Back to Course
        </button>

        <div className="section-label" style={{ marginBottom: 8 }}>
          Course Content
        </div>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Add Lectures
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          Create lecture titles, then upload videos in edit mode.
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <input
            className="ev-input"
            type="text"
            placeholder="e.g. Introduction to MERN Stack"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleCreateLecture();
              }
            }}
            style={{ flex: 1 }}
          />

          <button
            className="btn-primary"
            style={{
              gap: 6,
              whiteSpace: "nowrap",
              paddingLeft: 16,
              paddingRight: 16,
            }}
            disabled={loading}
            onClick={handleCreateLecture}
          >
            {loading ? (
              <ClipLoader size={18} color="var(--bg-primary)" />
            ) : (
              <>
                <FaPlus size={12} /> Add
              </>
            )}
          </button>
        </div>

        {/* Lecture List */}
        {fetching ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <ClipLoader size={28} color="var(--accent)" />
            <p style={{ color: "var(--text-muted)", marginTop: 12 }}>
              Loading lectures...
            </p>
          </div>
        ) : lectureData?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              {lectureData.length} lecture
              {lectureData.length !== 1 ? "s" : ""}
            </div>

            {lectureData.map((lecture, index) => (
              <div
                key={lecture._id}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>

                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {lecture.lectureTitle}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate(`/editlecture/${courseId}/${lecture._id}`)
                  }
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  <FaEdit size={11} /> Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "32px 20px",
              color: "var(--text-muted)",
              background: "var(--bg-secondary)",
              borderRadius: 16,
              border: "1px dashed var(--border-hover)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
            <p style={{ fontSize: 14 }}>
              No lectures yet. Add your first one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLecture;
