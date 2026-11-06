import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle, FaCheckCircle, FaTrophy, FaDownload } from "react-icons/fa";
import DoubtSolver from "../component/DoubtSolver";

function ViewLectures() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find((c) => c._id === courseId);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingDone, setMarkingDone] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);

  // ── set first lecture on load ──────────────────────────────────────
  useEffect(() => {
    if (selectedCourse?.lectures?.length && !selectedLecture) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse]);

  // ── fetch creator ──────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCourse?.creator) return;
    const fetchCreator = async () => {
      try {
        const { data } = await axios.post(
          serverUrl + "/api/course/creator",
          { userId: selectedCourse.creator },
          { withCredentials: true },
        );
        setCreatorData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCreator();
  }, [selectedCourse]);

  // ── BUG FIX: /api/features/progress se fetch karo ─────────────────
  useEffect(() => {
    if (!courseId) return;
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(
          serverUrl + `/api/features/progress/${courseId}`,
          { withCredentials: true },
        );
        setCompletedIds(data.completedLectures || []);
        setProgressPercent(data.percentage || 0);
        setIsCompleted(data.isCompleted || false);
      } catch (e) {
        // no progress yet — that's fine
      }
    };
    fetchProgress();
  }, [courseId]);

  // ── BUG FIX: /api/features/progress/mark pe call karo ─────────────
  const handleMarkComplete = useCallback(
    async (lectureId) => {
      if (!lectureId) return;
      const alreadyDone = completedIds.some(
        (id) => id.toString() === lectureId.toString(),
      );
      if (alreadyDone) return;

      setMarkingDone(true);
      try {
        const { data } = await axios.post(
          serverUrl + "/api/features/progress/mark",
          { courseId, lectureId },
          { withCredentials: true },
        );
        setCompletedIds(data.completedLectures || []);
        setProgressPercent(
          data.percentage ??
          (data.completedLectures?.length && selectedCourse?.lectures?.length
            ? Math.round((data.completedLectures.length / selectedCourse.lectures.length) * 100)
            : 0)
        );
        setIsCompleted(data.isCompleted || false);

        // Redux userData bhi refresh karo
        const userRes = await axios.get(
          serverUrl + "/api/user/getcurrentuser",
          { withCredentials: true },
        );
        dispatch(setUserData(userRes.data));
      } catch (e) {
        console.error("Failed to mark lecture complete:", e);
      } finally {
        setMarkingDone(false);
      }
    },
    [completedIds, courseId, dispatch, selectedCourse],
  );

  const isLectureCompleted = (lectureId) =>
    completedIds.some((id) => id.toString() === lectureId?.toString());

  const totalLectures = selectedCourse?.lectures?.length || 0;

  // ── auto-advance on video end ──────────────────────────────────────
  const handleVideoEnd = () => {
    if (!selectedLecture) return;
    handleMarkComplete(selectedLecture._id);

    const lectures = selectedCourse?.lectures || [];
    const currentIdx = lectures.findIndex((l) => l._id === selectedLecture._id);
    if (currentIdx < lectures.length - 1) {
      setSelectedLecture(lectures[currentIdx + 1]);
    }
  };

  // ── apply playback speed ───────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, selectedLecture]);

  return (
    <>
      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
            .vl-root {
                min-height:100vh;
                background:#0a0a0f;
                font-family:'DM Sans',sans-serif;
                display:flex;
                flex-direction:column;
            }
            .vl-topbar {
                background:#111118;
                border-bottom:1px solid #1f1f2e;
                padding:14px 24px;
                display:flex;
                align-items:center;
                gap:16px;
                position:sticky;
                top:0;
                z-index:10;
            }
            .vl-back {
                display:flex;align-items:center;gap:6px;
                color:#6b7280;font-size:13px;cursor:pointer;
                background:none;border:none;font-family:'DM Sans',sans-serif;
                padding:0;transition:color 0.2s;
            }
            .vl-back:hover{color:#e5e7eb;}
            .vl-course-title {
                font-family:'Syne',sans-serif;
                font-size:16px;font-weight:700;color:#f0f0f0;
                flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
            }
            .vl-topbar-meta {
                font-size:12px;color:#4b5563;white-space:nowrap;
            }
            .vl-body {
                display:flex;flex:1;overflow:hidden;
            }
            .vl-left {
                flex:1;padding:24px;display:flex;flex-direction:column;gap:16px;
                min-width:0;overflow-y:auto;
            }
            .vl-player-wrap {
                background:#000;
                border-radius:16px;
                overflow:hidden;
                aspect-ratio:16/9;
                width:100%;
                position:relative;
            }
            .vl-player-wrap video {
                width:100%;height:100%;
            }
            .vl-player-empty {
                width:100%;height:100%;
                display:flex;flex-direction:column;
                align-items:center;justify-content:center;
                color:#4b5563;gap:12px;
            }
            .vl-lecture-info {
                background:#111118;
                border:1px solid #1f1f2e;
                border-radius:14px;
                padding:16px 20px;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                flex-wrap:wrap;
            }
            .vl-lecture-title {
                font-family:'Syne',sans-serif;
                font-size:18px;font-weight:700;color:#f0f0f0;
            }
            .vl-mark-btn {
                display:flex;align-items:center;gap:8px;
                padding:8px 18px;
                border-radius:10px;
                border:none;cursor:pointer;
                font-family:'DM Sans',sans-serif;
                font-size:13px;font-weight:600;
                transition:all 0.2s;white-space:nowrap;
            }
            .vl-mark-btn.done {
                background:rgba(34,197,94,0.12);
                color:#22c55e;
                border:1px solid rgba(34,197,94,0.2);
                cursor:default;
            }
            .vl-mark-btn.undone {
                background:#6366f1;color:white;
            }
            .vl-mark-btn.undone:hover{background:#4f46e5;}
            .vl-mark-btn:disabled{opacity:0.6;cursor:not-allowed;}
            .vl-speed-bar {
                display:flex;align-items:center;gap:8px;flex-wrap:wrap;
            }
            .vl-speed-label {
                font-size:12px;color:#6b7280;font-weight:600;
                text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;
            }
            .vl-speed-btn {
                padding:5px 12px;border-radius:8px;
                border:1px solid #1f1f2e;
                background:none;cursor:pointer;
                font-family:'DM Sans',sans-serif;
                font-size:13px;font-weight:600;color:#6b7280;
                transition:all 0.15s;
            }
            .vl-speed-btn:hover { border-color:#6366f1;color:#818cf8; }
            .vl-speed-btn.active {
                background:#6366f1;color:white;border-color:#6366f1;
            }
            .vl-overall-progress {
                background:#111118;
                border:1px solid #1f1f2e;
                border-radius:14px;
                padding:14px 20px;
            }
            .vl-prog-header {
                display:flex;justify-content:space-between;
                font-size:12px;color:#6b7280;margin-bottom:8px;
            }
            .vl-prog-track {
                height:6px;background:#1f1f2e;border-radius:99px;overflow:hidden;
            }
            .vl-prog-fill {
                height:100%;
                background:linear-gradient(90deg,#6366f1,#818cf8);
                border-radius:99px;
                transition:width 0.5s ease;
            }
            .vl-prog-fill.completed {
                background:linear-gradient(90deg,#43e97b,#38f9d7);
            }
            .vl-certificate-bar {
                display:flex;align-items:center;justify-content:space-between;
                margin-top:12px;padding-top:12px;
                border-top:1px solid #1f1f2e;
                flex-wrap:wrap;gap:8px;
            }
            .vl-cert-msg {
                display:flex;align-items:center;gap:6px;
                font-size:13px;color:#22c55e;font-weight:600;
            }
            .vl-cert-btn {
                display:inline-flex;align-items:center;gap:6px;
                padding:7px 16px;border-radius:9px;
                background:rgba(67,233,123,0.1);
                border:1px solid rgba(67,233,123,0.3);
                color:#22c55e;cursor:pointer;
                font-size:12px;font-weight:600;
                font-family:'DM Sans',sans-serif;
                transition:all 0.2s;
            }
            .vl-cert-btn:hover{background:rgba(67,233,123,0.2);}
            .vl-sidebar {
                width:320px;
                flex-shrink:0;
                background:#111118;
                border-left:1px solid #1f1f2e;
                display:flex;
                flex-direction:column;
                overflow:hidden;
            }
            .vl-sidebar-header {
                padding:20px 20px 14px;
                border-bottom:1px solid #1f1f2e;
            }
            .vl-sidebar-title {
                font-family:'Syne',sans-serif;
                font-size:15px;font-weight:700;color:#f0f0f0;margin-bottom:4px;
            }
            .vl-sidebar-sub {
                font-size:12px;color:#4b5563;
            }
            .vl-lecture-list {
                flex:1;overflow-y:auto;padding:12px;
                display:flex;flex-direction:column;gap:4px;
            }
            .vl-lecture-list::-webkit-scrollbar{width:4px;}
            .vl-lecture-list::-webkit-scrollbar-track{background:transparent;}
            .vl-lecture-list::-webkit-scrollbar-thumb{background:#2a2a3e;border-radius:99px;}
            .vl-lec-btn {
                width:100%;
                display:flex;align-items:center;gap:10px;
                padding:10px 12px;
                border-radius:10px;
                border:1px solid transparent;
                background:none;cursor:pointer;
                text-align:left;
                transition:all 0.15s;
                font-family:'DM Sans',sans-serif;
            }
            .vl-lec-btn:hover { background:#1a1a2e; }
            .vl-lec-btn.active {
                background:#1e1b4b;
                border-color:#4338ca;
            }
            .vl-lec-num {
                width:26px;height:26px;border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:600;flex-shrink:0;
            }
            .vl-lec-num.done { background:rgba(34,197,94,0.15);color:#22c55e; }
            .vl-lec-num.active { background:#6366f1;color:white; }
            .vl-lec-num.pending { background:#1f1f2e;color:#4b5563; }
            .vl-lec-name {
                font-size:13px;font-weight:500;
                flex:1;line-height:1.3;
                display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
            }
            .vl-lec-name.done { color:#6b7280; }
            .vl-lec-name.active { color:#f0f0f0; }
            .vl-lec-name.pending { color:#9ca3af; }
            .vl-educator {
                padding:16px 20px;
                border-top:1px solid #1f1f2e;
            }
            .vl-educator-title {
                font-size:11px;font-weight:600;color:#4b5563;
                text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;
            }
            .vl-educator-row {
                display:flex;align-items:center;gap:10px;
            }
            .vl-edu-avatar {
                width:40px;height:40px;border-radius:50%;
                object-fit:cover;flex-shrink:0;
            }
            .vl-edu-fallback {
                width:40px;height:40px;border-radius:50%;
                background:#1e1b4b;color:#818cf8;
                display:flex;align-items:center;justify-content:center;
                font-weight:700;font-size:16px;flex-shrink:0;
            }
            .vl-edu-name { font-size:13px;font-weight:600;color:#e5e7eb; }
            .vl-edu-bio  { font-size:11px;color:#6b7280;margin-top:1px; }

            @media(max-width:768px){
                .vl-body{flex-direction:column;}
                .vl-sidebar{width:100%;border-left:none;border-top:1px solid #1f1f2e;}
                .vl-lecture-list{max-height:300px;}
            }
        `}</style>

      <div className="vl-root">
        {/* ── TOP BAR ── */}
        <div className="vl-topbar">
          <button className="vl-back" onClick={() => navigate("/mycourses")}>
            <FaArrowLeftLong size={12} /> My Courses
          </button>
          <span className="vl-course-title">{selectedCourse?.title}</span>
          <span className="vl-topbar-meta">
            {completedIds.length}/{totalLectures} completed
          </span>
        </div>

        <div className="vl-body">
          {/* ── LEFT: VIDEO + INFO ── */}
          <div className="vl-left">
            {/* Video Player */}
            <div className="vl-player-wrap">
              {selectedLecture?.videoUrl ? (
                <video
                  ref={videoRef}
                  key={selectedLecture._id}
                  src={selectedLecture.videoUrl}
                  controls
                  onEnded={handleVideoEnd}
                  autoPlay
                />
              ) : (
                <div className="vl-player-empty">
                  <FaPlayCircle size={52} color="#2a2a3e" />
                  <p style={{ fontSize: 14 }}>
                    Select a lecture to start watching
                  </p>
                </div>
              )}
            </div>

            {/* Lecture title + mark complete */}
            {selectedLecture && (
              <div className="vl-lecture-info">
                <div>
                  <div className="vl-lecture-title">
                    {selectedLecture.lectureTitle}
                  </div>
                  <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>
                    {selectedCourse?.category} • {selectedCourse?.level}
                  </div>
                </div>

                {isLectureCompleted(selectedLecture._id) ? (
                  <button className="vl-mark-btn done" disabled>
                    <FaCheckCircle size={14} /> Completed
                  </button>
                ) : (
                  <button
                    className="vl-mark-btn undone"
                    disabled={markingDone}
                    onClick={() => handleMarkComplete(selectedLecture._id)}
                  >
                    {markingDone ? "Saving..." : "✓ Mark as Complete"}
                  </button>
                )}
              </div>
            )}

            {/* Speed Control */}
            {selectedLecture?.videoUrl && (
              <div
                style={{
                  background: "#111118",
                  border: "1px solid #1f1f2e",
                  borderRadius: 14,
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span className="vl-speed-label">Speed</span>
                <div className="vl-speed-bar">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      className={`vl-speed-btn ${playbackSpeed === speed ? "active" : ""}`}
                      onClick={() => setPlaybackSpeed(speed)}
                    >
                      {speed === 1 ? "1x (Normal)" : `${speed}x`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Overall progress + Certificate */}
            <div className="vl-overall-progress">
              <div className="vl-prog-header">
                <span>Course Progress</span>
                <span
                  style={{
                    color: progressPercent === 100 ? "#22c55e" : "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {progressPercent}%
                  {progressPercent === 100 && " 🎉 Completed!"}
                </span>
              </div>
              <div className="vl-prog-track">
                <div
                  className={`vl-prog-fill ${progressPercent === 100 ? "completed" : ""}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Certificate button — sirf 100% hone par dikhega */}
              {isCompleted && (
                <div className="vl-certificate-bar">
                  <div className="vl-cert-msg">
                    <FaTrophy size={14} /> Course Completed! Congratulations 🎉
                  </div>
                  <button
                    className="vl-cert-btn"
                    onClick={() =>
                      window.open(
                        `${serverUrl}/api/features/certificate/${courseId}`,
                        "_blank",
                      )
                    }
                  >
                    <FaDownload size={11} /> Download Certificate
                  </button>
                </div>
              )}
            </div>

            {/* DoubtSolver */}
            <DoubtSolver
              courseTitle={selectedCourse?.title}
              lectureTitle={selectedLecture?.lectureTitle}
            />
          </div>

          {/* ── RIGHT: SIDEBAR ── */}
          <div className="vl-sidebar">
            <div className="vl-sidebar-header">
              <div className="vl-sidebar-title">Course Content</div>
              <div className="vl-sidebar-sub">
                {totalLectures} lectures • {completedIds.length} done
              </div>
            </div>

            <div className="vl-lecture-list">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, i) => {
                  const done = isLectureCompleted(lecture._id);
                  const active = selectedLecture?._id === lecture._id;
                  const state = done ? "done" : active ? "active" : "pending";

                  return (
                    <button
                      key={lecture._id || i}
                      className={`vl-lec-btn ${active ? "active" : ""}`}
                      onClick={() => setSelectedLecture(lecture)}
                    >
                      <div className={`vl-lec-num ${state}`}>
                        {done ? <FaCheckCircle size={13} /> : i + 1}
                      </div>
                      <span className={`vl-lec-name ${state}`}>
                        {lecture.lectureTitle}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: "#4b5563",
                    padding: "20px 0",
                    textAlign: "center",
                  }}
                >
                  No lectures available.
                </p>
              )}
            </div>

            {/* Educator info */}
            {creatorData && (
              <div className="vl-educator">
                <div className="vl-educator-title">Instructor</div>
                <div className="vl-educator-row">
                  {creatorData.photoUrl ? (
                    <img
                      src={creatorData.photoUrl}
                      className="vl-edu-avatar"
                      alt={creatorData.name}
                    />
                  ) : (
                    <div className="vl-edu-fallback">
                      {creatorData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="vl-edu-name">{creatorData.name}</div>
                    {creatorData.description && (
                      <div className="vl-edu-bio">
                        {creatorData.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewLectures;
