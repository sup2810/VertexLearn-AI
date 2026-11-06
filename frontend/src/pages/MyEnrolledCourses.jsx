import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  FaPlayCircle,
  FaBookOpen,
  FaGraduationCap,
  FaCheckCircle,
  FaBrain,
  FaStickyNote,
  FaMap,
} from "react-icons/fa";
import SmartRecommendations from "../component/SmartRecommendations";

function MyEnrolledCourses() {
  const { userData } = useSelector((state) => state.user);
  const { courseData } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // BUG FIX: Progress API se har course ka progress fetch karo
  // userData.courseProgress pe depend nahi karna — directly API call karo
  const [progressMap, setProgressMap] = useState({});
  const [progressLoading, setProgressLoading] = useState(true);

  // Page khulte hi fresh user data fetch karo
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const { data } = await axios.get(
          serverUrl + "/api/user/getcurrentuser",
          { withCredentials: true },
        );
        dispatch(setUserData(data));
      } catch (e) {
        console.error("Failed to refresh user:", e);
      }
    };
    refreshUser();
  }, [dispatch]);

  // Match enrolled IDs → full course objects from courseData
  const enrolledCourses = useMemo(() => {
    if (!userData?.enrolledCourses?.length || !courseData?.length) return [];
    return userData.enrolledCourses
      .map((enrolled) => {
        const enrolledId =
          typeof enrolled === "string" ? enrolled : enrolled?._id?.toString();
        return courseData.find((c) => c._id?.toString() === enrolledId);
      })
      .filter(Boolean);
  }, [userData?.enrolledCourses, courseData]);

  // BUG FIX: Har enrolled course ka progress /api/features/progress/:courseId se fetch karo
  useEffect(() => {
    if (!enrolledCourses.length) {
      setProgressLoading(false);
      return;
    }

    const fetchAllProgress = async () => {
      setProgressLoading(true);
      const map = {};
      await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const { data } = await axios.get(
              serverUrl + `/api/features/progress/${course._id}`,
              { withCredentials: true },
            );
            map[course._id] = {
              percent: data.percentage ?? 0,
              completed: data.completedCount ?? 0,
              done: data.isCompleted ?? false,
            };
          } catch (e) {
            // Course ka koi progress nahi abhi tak
            map[course._id] = { percent: 0, completed: 0, done: false };
          }
        }),
      );
      setProgressMap(map);
      setProgressLoading(false);
    };

    fetchAllProgress();
  }, [enrolledCourses.length]);

  // progressMap se progress lo, fallback 0
  const getProgress = (courseId) => {
    return progressMap[courseId] ?? { percent: 0, completed: 0, done: false };
  };

  const isEmpty = enrolledCourses.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .ec-root{min-height:100vh;background:#0a0a0f;padding:0 0 60px;font-family:'DM Sans',sans-serif;position:relative;}
        .ec-root::before{content:'';position:fixed;top:-100px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 70%);pointer-events:none;z-index:0;}
        .ec-header{padding:32px 48px 0;position:relative;z-index:1;}
        .ec-back{display:inline-flex;align-items:center;gap:8px;color:#6b7280;font-size:14px;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;padding:0;margin-bottom:24px;transition:color 0.2s;}
        .ec-back:hover{color:#e5e7eb;}
        .ec-eyebrow{font-size:12px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;}
        .ec-title{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#f5f5f5;line-height:1.1;margin-bottom:8px;}
        .ec-subtitle{font-size:15px;color:#6b7280;margin-bottom:40px;}
        .ec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;padding:0 48px;position:relative;z-index:1;}
        @media(max-width:600px){.ec-header{padding:24px 20px 0;}.ec-grid{padding:0 20px;grid-template-columns:1fr;}.ec-title{font-size:28px;}}
        .ec-card{background:#111118;border:1px solid #1f1f2e;border-radius:20px;overflow:hidden;cursor:pointer;transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;animation:fadeUp 0.4s ease both;}
        .ec-card:hover{transform:translateY(-4px);border-color:#6366f1;box-shadow:0 16px 48px rgba(99,102,241,0.18);}
        .ec-card.done-card{border-color:rgba(34,197,94,0.3);}
        .ec-card.done-card:hover{border-color:#22c55e;box-shadow:0 16px 48px rgba(34,197,94,0.15);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .ec-thumb-wrap{position:relative;width:100%;aspect-ratio:16/9;background:#1a1a2e;overflow:hidden;}
        .ec-thumb{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;}
        .ec-card:hover .ec-thumb{transform:scale(1.04);}
        .ec-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.25s;}
        .ec-card:hover .ec-overlay{opacity:1;}
        .ec-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#4b5563;gap:8px;}
        .ec-cat-badge{position:absolute;top:12px;left:12px;background:rgba(99,102,241,0.85);color:white;font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:0.04em;text-transform:uppercase;backdrop-filter:blur(4px);}
        .ec-done-badge{position:absolute;top:12px;right:12px;background:rgba(34,197,94,0.85);color:white;font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;display:flex;align-items:center;gap:4px;backdrop-filter:blur(4px);}
        .ec-body{padding:16px 18px 18px;}
        .ec-course-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#f0f0f0;margin-bottom:6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .ec-meta{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
        .ec-level{font-size:11px;color:#6b7280;background:#1f1f2e;border:1px solid #2a2a3e;padding:2px 8px;border-radius:20px;text-transform:capitalize;}
        .ec-prog-wrap{margin-bottom:14px;}
        .ec-prog-label{display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:5px;}
        .ec-prog-track{height:5px;background:#1f1f2e;border-radius:99px;overflow:hidden;}
        .ec-prog-fill{height:100%;border-radius:99px;transition:width 0.6s ease;}
        .ec-prog-fill.indigo{background:linear-gradient(90deg,#6366f1,#818cf8);}
        .ec-prog-fill.green{background:#22c55e;}
        .ec-btn{width:100%;padding:11px;color:white;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s,transform 0.15s;}
        .ec-btn.start{background:#6366f1;}
        .ec-btn.start:hover{background:#4f46e5;transform:translateY(-1px);}
        .ec-btn.resume{background:#1e3a5f;color:#60a5fa;border:1px solid #1e40af;}
        .ec-btn.resume:hover{background:#1e3a8a;}
        .ec-btn.rewatch{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.25);}
        .ec-btn.rewatch:hover{background:rgba(34,197,94,0.18);}
        .ec-action-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px;}
        .ec-action-btn{padding:9px 6px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.2s;}
        .ec-action-btn.quiz{background:rgba(251,146,60,0.12);color:#fb923c;border:1px solid rgba(251,146,60,0.25);}
        .ec-action-btn.quiz:hover{background:rgba(251,146,60,0.22);transform:translateY(-1px);}
        .ec-action-btn.notes{background:rgba(139,92,246,0.12);color:#a78bfa;border:1px solid rgba(139,92,246,0.25);}
        .ec-action-btn.notes:hover{background:rgba(139,92,246,0.22);transform:translateY(-1px);}
        .ec-action-btn.roadmap{background:rgba(20,184,166,0.12);color:#2dd4bf;border:1px solid rgba(20,184,166,0.25);}
        .ec-action-btn.roadmap:hover{background:rgba(20,184,166,0.22);transform:translateY(-1px);}
        .ec-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;color:#4b5563;text-align:center;padding:40px 20px;position:relative;z-index:1;}
        .ec-empty-icon{opacity:0.3;margin-bottom:16px;}
        .ec-empty h3{font-family:'Syne',sans-serif;font-size:20px;color:#6b7280;margin-bottom:8px;}
        .ec-empty p{font-size:14px;margin-bottom:24px;}
        .ec-empty-btn{background:#6366f1;color:white;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:10px 24px;border:none;border-radius:12px;cursor:pointer;transition:background 0.2s;}
        .ec-empty-btn:hover{background:#4f46e5;}
        .ec-recommendations{padding:48px 48px 0;position:relative;z-index:1;}
        @media(max-width:600px){.ec-recommendations{padding:32px 20px 0;}}
      `}</style>

      <div className="ec-root">
        <div className="ec-header">
          <button className="ec-back" onClick={() => navigate("/")}>
            <FaArrowLeftLong size={13} /> Back
          </button>
          <p className="ec-eyebrow">My Learning</p>
          <h1 className="ec-title">Enrolled Courses</h1>
          <p className="ec-subtitle">
            {isEmpty
              ? "Start learning something new today"
              : `${enrolledCourses.length} ${enrolledCourses.length === 1 ? "course" : "courses"} in progress`}
          </p>
        </div>

        {isEmpty ? (
          <div className="ec-empty">
            <div className="ec-empty-icon">
              <FaBookOpen size={64} />
            </div>
            <h3>No courses yet</h3>
            <p>
              You haven't enrolled in any course yet.
              <br />
              Browse and find something you love.
            </p>
            <button
              className="ec-empty-btn"
              onClick={() => navigate("/allcourses")}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <div className="ec-grid">
              {enrolledCourses.map((course, i) => {
                const { percent, completed, done } = getProgress(course._id);
                const lectureCount = course.lectures?.length ?? 0;

                return (
                  <div
                    key={course._id || i}
                    className={`ec-card ${done ? "done-card" : ""}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="ec-thumb-wrap">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="ec-thumb"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(
                              ".ec-placeholder",
                            ).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="ec-placeholder"
                        style={{
                          display: course.thumbnail ? "none" : "flex",
                          position: course.thumbnail ? "absolute" : "relative",
                          inset: 0,
                        }}
                      >
                        <FaGraduationCap size={40} />
                        <span style={{ fontSize: 12 }}>
                          {course.category || "Course"}
                        </span>
                      </div>

                      <div className="ec-overlay">
                        <FaPlayCircle
                          size={52}
                          color="white"
                          style={{
                            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
                          }}
                        />
                      </div>

                      {course.category && (
                        <span className="ec-cat-badge">{course.category}</span>
                      )}

                      {done && (
                        <span className="ec-done-badge">
                          <FaCheckCircle size={10} /> Done
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="ec-body">
                      <h2 className="ec-course-title">
                        {course.title || "Untitled Course"}
                      </h2>

                      <div className="ec-meta">
                        {course.level && (
                          <span className="ec-level">{course.level}</span>
                        )}
                        <span style={{ fontSize: 11, color: "#4b5563" }}>
                          {lectureCount} lecture{lectureCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="ec-prog-wrap">
                        <div className="ec-prog-label">
                          <span>
                            {progressLoading
                              ? "Loading..."
                              : done
                                ? "🎉 Completed!"
                                : percent > 0
                                  ? `${completed} lecture${completed !== 1 ? "s" : ""} done`
                                  : "Not started"}
                          </span>
                          <span
                            style={{
                              color: done ? "#22c55e" : "#6b7280",
                              fontWeight: 600,
                            }}
                          >
                            {progressLoading ? "—" : `${percent}%`}
                          </span>
                        </div>
                        <div className="ec-prog-track">
                          <div
                            className={`ec-prog-fill ${done ? "green" : "indigo"}`}
                            style={{ width: progressLoading ? "0%" : `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Watch CTA */}
                      <button
                        className={`ec-btn ${done ? "rewatch" : percent > 0 ? "resume" : "start"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/viewlecture/${course._id}`);
                        }}
                      >
                        <FaPlayCircle size={14} />
                        {done
                          ? "Rewatch Course"
                          : percent > 0
                            ? "Resume"
                            : "Start Learning"}
                      </button>

                      {/* Action buttons: Quiz + Notes + Roadmap */}
                      <div className="ec-action-row">
                        <button
                          className="ec-action-btn quiz"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/quiz/${course._id}`);
                          }}
                        >
                          <FaBrain size={12} /> Quiz
                        </button>
                        <button
                          className="ec-action-btn notes"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/notes/${course._id}`);
                          }}
                        >
                          <FaStickyNote size={12} /> Notes
                        </button>
                        <button
                          className="ec-action-btn roadmap"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/roadmap");
                          }}
                        >
                          <FaMap size={12} /> Roadmap
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Recommendations */}
            <div className="ec-recommendations">
              <SmartRecommendations />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MyEnrolledCourses;
