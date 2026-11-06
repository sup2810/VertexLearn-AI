import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong, FaTrash, FaVideo } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector((state) => state.lecture);
  const selectedLecture = lectureData.find(
    (lecture) => lecture._id === lectureId,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || "",
  );
  const [videoUrl, setVideoUrl] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || false,
  );
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [videoName, setVideoName] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoUrl(file);
      setVideoName(file.name);
    }
  };

  const handleEditLecture = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("lectureTitle", lectureTitle);
      formdata.append("videoUrl", videoUrl);
      formdata.append("isPreviewFree", isPreviewFree);

      const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formdata,
        { withCredentials: true },
      );
      const updatedLectures = (lectureData || []).map((lecture) =>
        lecture._id === lectureId ? result.data : lecture,
      );

      dispatch(setLectureData(updatedLectures));
      toast.success("Lecture Updated");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const removeLecture = async () => {
    setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture Removed");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    } finally {
      setLoading1(false);
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
          maxWidth: 560,
          background: "var(--bg-card)",
          borderRadius: 24,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          padding: "40px 36px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 14,
              marginBottom: 16,
              padding: 0,
            }}
          >
            <FaArrowLeftLong /> Back to Lectures
          </button>
          <div className="section-label" style={{ marginBottom: 6 }}>
            Lecture Settings
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Edit Lecture
          </h1>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Lecture Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Lecture Title
            </label>
            <input
              className="ev-input"
              type="text"
              placeholder="e.g. Introduction to React Hooks"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          {/* Video Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Upload Video
            </label>
            <label
              htmlFor="video-upload"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderRadius: 12,
                border: `2px dashed ${videoName ? "var(--accent)" : "var(--border-hover)"}`,
                background: videoName
                  ? "rgba(108,99,255,0.04)"
                  : "var(--bg-secondary)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = videoName
                  ? "var(--accent)"
                  : "var(--border-hover)")
              }
            >
              {videoName ? (
                <FaCheckCircle size={18} color="#16a34a" />
              ) : (
                <FaVideo size={18} color="var(--text-muted)" />
              )}
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: videoName
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  {videoName || "Choose video file"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {videoName ? "File selected ✓" : "MP4, MOV, AVI supported"}
                </div>
              </div>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleVideoChange}
            />
          </div>

          {/* Free Preview Toggle */}
          <label
            htmlFor="isFree"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderRadius: 12,
              border: `1px solid ${isPreviewFree ? "var(--accent)" : "var(--border)"}`,
              background: isPreviewFree
                ? "rgba(108,99,255,0.06)"
                : "var(--bg-secondary)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: `2px solid ${isPreviewFree ? "var(--accent)" : "var(--border-hover)"}`,
                background: isPreviewFree ? "var(--accent)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {isPreviewFree && (
                <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </div>
            <input
              type="checkbox"
              id="isFree"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree((prev) => !prev)}
              style={{ display: "none" }}
            />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Free Preview
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Students can watch this lecture before enrolling
              </div>
            </div>
          </label>

          {/* Uploading state */}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "rgba(108,99,255,0.06)",
                borderRadius: 10,
                border: "1px solid rgba(108,99,255,0.2)",
              }}
            >
              <ClipLoader size={16} color="var(--accent)" />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 500,
                }}
              >
                Uploading video... Please wait
              </span>
            </div>
          )}

          {/* Update Button */}
          <button
            className="btn-primary"
            style={{ justifyContent: "center", height: 48, fontSize: 15 }}
            disabled={loading}
            onClick={handleEditLecture}
          >
            {loading ? (
              <ClipLoader size={20} color="var(--bg-primary)" />
            ) : (
              "Update Lecture"
            )}
          </button>

          {/* Danger Zone */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#ef4444",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Danger Zone
            </div>
            <button
              onClick={removeLecture}
              disabled={loading1}
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#ef4444",
                borderRadius: 12,
                padding: "11px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fee2e2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#fef2f2")
              }
            >
              {loading1 ? (
                <ClipLoader size={16} color="#ef4444" />
              ) : (
                <>
                  <FaTrash size={13} /> Remove Lecture
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
