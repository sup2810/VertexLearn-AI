import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import Nav from "../component/Nav";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaGraduationCap,
  FaBookOpen,
  FaClock,
  FaFire,
} from "react-icons/fa";
import {
  FaArrowRight,
  FaStar,
} from "react-icons/fa6";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

function StudentDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { courseData } = useSelector((state) => state.course);

  // Fresh user fetch on mount so progress is latest
  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await axios.get(serverUrl + "/api/user/getcurrentuser", {
          withCredentials: true,
        });
        dispatch(setUserData(data));
      } catch (e) {
        console.error(e);
      }
    };
    refresh();
  }, [dispatch]);

  // Enrolled courses matched with full course objects
  const enrolledCourses = useMemo(() => {
    if (!userData?.enrolledCourses?.length || !courseData?.length) return [];
    return userData.enrolledCourses
      .map((enrolled) => {
        const id = typeof enrolled === "string" ? enrolled : enrolled?._id?.toString();
        return courseData.find((c) => c._id?.toString() === id);
      })
      .filter(Boolean);
  }, [userData?.enrolledCourses, courseData]);

  // Get progress for a course
  const getProgress = (courseId) => {
    if (!userData?.courseProgress?.length) return { percent: 0, completed: 0, done: false };
    const entry = userData.courseProgress.find((p) => {
      const pid = typeof p.course === "string" ? p.course : p.course?._id?.toString();
      return pid === courseId?.toString();
    });
    if (!entry) return { percent: 0, completed: 0, done: false };
    return {
      percent: entry.progressPercent ?? 0,
      completed: entry.completedLectures?.length ?? 0,
      done: (entry.progressPercent ?? 0) === 100,
    };
  };

  // Stats
  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter((c) => getProgress(c._id).done).length;
  const inProgress = enrolledCourses.filter((c) => {
    const p = getProgress(c._id);
    return p.percent > 0 && !p.done;
  }).length;
  const notStarted = enrolledCourses.filter((c) => getProgress(c._id).percent === 0).length;

  const totalLecturesCompleted = userData?.courseProgress?.reduce(
    (sum, p) => sum + (p.completedLectures?.length ?? 0), 0
  ) ?? 0;

  // Overall progress average
  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + getProgress(c._id).percent, 0) /
            enrolledCourses.length
        )
      : 0;

  // Chart data — progress per course
  const chartData = enrolledCourses.map((c) => ({
    name: c.title?.length > 14 ? c.title.slice(0, 14) + "…" : c.title,
    progress: getProgress(c._id).percent,
  }));

  // Continue watching — last in-progress course
  const continueWatching = enrolledCourses.find((c) => {
    const p = getProgress(c._id);
    return p.percent > 0 && !p.done;
  });

  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();

  const customTooltipStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 13,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 60px" }}>

        {/* ── Welcome Card ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "3px solid var(--border-hover)",
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Syne, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "white",
            }}
          >
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              avatarChar
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 4,
              }}
            >
              Student Dashboard
            </div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Welcome back, {userData?.name} 👋
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {completedCourses > 0
                ? `You've completed ${completedCourses} course${completedCourses > 1 ? "s" : ""}. Keep going!`
                : "Start learning and track your progress here."}
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ gap: 8 }}
            onClick={() => navigate("/allcourses")}
          >
            <FaBookOpen size={14} /> Browse Courses
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              icon: <FaBookOpen size={18} />,
              label: "Total Enrolled",
              value: totalEnrolled,
              sub: "courses",
              color: "#6c63ff",
            },
            {
              icon: <FaCheckCircle size={18} />,
              label: "Completed",
              value: completedCourses,
              sub: "courses done",
              color: "#43e97b",
            },
            {
              icon: <FaClock size={18} />,
              label: "In Progress",
              value: inProgress,
              sub: "ongoing",
              color: "#ff9f43",
            },
            {
              icon: <FaFire size={18} />,
              label: "Lectures Done",
              value: totalLecturesCompleted,
              sub: "total watched",
              color: "#ff6b6b",
            },
            {
              icon: <FaGraduationCap size={18} />,
              label: "Avg. Progress",
              value: `${avgProgress}%`,
              sub: "across courses",
              color: "#54a0ff",
            },
          ].map(({ icon, label, value, sub, color }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color,
                  marginBottom: 14,
                }}
              >
                {icon}
              </div>
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
                {label}
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 2,
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Continue Watching + Chart ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          {/* Continue Watching */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow)",
            }}
          >
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              Continue Watching
            </h3>

            {continueWatching ? (
              <div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 14,
                    background: "var(--bg-secondary)",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/viewlecture/${continueWatching._id}`)}
                >
                  {continueWatching.thumbnail ? (
                    <img
                      src={continueWatching.thumbnail}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                      }}
                    >
                      <FaGraduationCap size={40} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.38)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPlayCircle size={48} color="white" />
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  {continueWatching.title}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginBottom: 5,
                    }}
                  >
                    <span>{getProgress(continueWatching._id).completed} lectures done</span>
                    <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                      {getProgress(continueWatching._id).percent}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "var(--bg-secondary)",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${getProgress(continueWatching._id).percent}%`,
                        background: "var(--accent)",
                        borderRadius: 99,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", gap: 8 }}
                  onClick={() => navigate(`/viewlecture/${continueWatching._id}`)}
                >
                  <FaPlayCircle size={14} /> Resume Course
                </button>
              </div>
            ) : (
              <div
                style={{
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  gap: 12,
                }}
              >
                <FaPlayCircle size={36} style={{ opacity: 0.3 }} />
                <p style={{ fontSize: 14, textAlign: "center" }}>
                  {totalEnrolled === 0
                    ? "Enroll in a course to start learning"
                    : completedCourses === totalEnrolled
                    ? "All courses completed! 🎉"
                    : "Start a course to continue here"}
                </p>
                <button
                  className="btn-outline"
                  style={{ fontSize: 13 }}
                  onClick={() => navigate("/allcourses")}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>

          {/* Progress Chart */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow)",
            }}
          >
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              Course Progress
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    formatter={(v) => [`${v}%`, "Progress"]}
                  />
                  <Bar dataKey="progress" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                No course data yet
              </div>
            )}
          </div>
        </div>

        {/* ── My Courses List ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              My Courses
            </h3>
            {totalEnrolled > 0 && (
              <button
                className="btn-outline"
                style={{ fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}
                onClick={() => navigate("/mycourses")}
              >
                View All <FaArrowRight size={11} />
              </button>
            )}
          </div>

          {enrolledCourses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-muted)",
              }}
            >
              <FaBookOpen size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
              <p style={{ fontSize: 14, marginBottom: 16 }}>
                You haven't enrolled in any course yet.
              </p>
              <button
                className="btn-primary"
                style={{ gap: 8 }}
                onClick={() => navigate("/allcourses")}
              >
                <FaBookOpen size={14} /> Browse Courses
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {enrolledCourses.slice(0, 5).map((course) => {
                const { percent, completed, done } = getProgress(course._id);
                const total = course.lectures?.length ?? 0;

                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 16px",
                      background: "var(--bg-secondary)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "var(--bg-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <FaGraduationCap size={22} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "Syne, sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--text-primary)",
                          marginBottom: 4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {course.title}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        {course.category && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "var(--accent)",
                              background: "var(--accent)" + "18",
                              padding: "2px 8px",
                              borderRadius: 20,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {course.category}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {completed}/{total} lectures
                        </span>
                      </div>

                      {/* Mini progress bar */}
                      <div
                        style={{
                          height: 4,
                          background: "var(--border)",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percent}%`,
                            background: done ? "#43e97b" : "var(--accent)",
                            borderRadius: 99,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right badge */}
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      {done ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#43e97b",
                            background: "#43e97b18",
                            padding: "4px 10px",
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FaCheckCircle size={10} /> Done
                        </span>
                      ) : (
                        <span
                          style={{
                            fontFamily: "Syne, sans-serif",
                            fontSize: 15,
                            fontWeight: 800,
                            color: percent > 0 ? "var(--accent)" : "var(--text-muted)",
                          }}
                        >
                          {percent}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {enrolledCourses.length > 5 && (
                <button
                  className="btn-outline"
                  style={{
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
                  onClick={() => navigate("/mycourses")}
                >
                  View all {enrolledCourses.length} courses <FaArrowRight size={11} />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
