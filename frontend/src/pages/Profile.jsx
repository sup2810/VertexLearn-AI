import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEnvelope, FaUserGraduate, FaBookOpen, FaPen } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const navigate = useNavigate();

  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();
  const isEducator = userData?.role === "educator";

  const enrolledCount = userData?.enrolledCourses?.length ?? 0;
  const createdCount = creatorCourseData?.length ?? 0;
  const courseCount = isEducator ? createdCount : enrolledCount;

  // BUG FIX: Progress API se completed count fetch karo
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (isEducator || !userData?.enrolledCourses?.length) return;

    const fetchAllProgress = async () => {
      try {
        let completed = 0;
        const promises = userData.enrolledCourses.map(async (enrolled) => {
          const courseId =
            typeof enrolled === "string" ? enrolled : enrolled?._id?.toString();
          try {
            const { data } = await axios.get(
              serverUrl + `/api/features/progress/${courseId}`,
              { withCredentials: true }
            );
            if (data.isCompleted) completed++;
          } catch (e) {
            // Is course ka progress nahi mila — ignore
          }
        });
        await Promise.all(promises);
        setCompletedCount(completed);
      } catch (e) {
        console.error("Failed to fetch progress:", e);
      }
    };

    fetchAllProgress();
  }, [userData?.enrolledCourses, isEducator]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .profile-root {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'DM Sans', sans-serif;
        }

        .profile-card {
          width: 100%;
          max-width: 460px;
          border-radius: 24px;
          overflow: hidden;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .profile-header {
          position: relative;
          height: 130px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
          overflow: hidden;
        }

        .profile-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.35) 0%, transparent 70%);
        }

        .profile-header::after {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          top: -60px;
          right: -40px;
        }

        .deco-circle {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          bottom: -50px;
          right: 40px;
        }

        .back-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 2;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.2); }

        .role-pill {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 2;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .avatar-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -52px;
          position: relative;
          z-index: 3;
          padding: 0 28px 28px;
        }

        .avatar-ring {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
          margin-bottom: 14px;
        }

        .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-letter {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: white;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-edit {
          position: absolute;
          top: 0;
          right: calc(50% - 64px);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .profile-name {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #f5f5f5;
          margin-bottom: 4px;
          text-align: center;
        }

        .profile-email-sub {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 24px;
          text-align: center;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: #2a2a2a;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 20px;
          width: 100%;
        }

        .stat-cell {
          background: #222;
          padding: 14px 8px;
          text-align: center;
        }

        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #f5f5f5;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #222;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 14px 16px;
          transition: border-color 0.2s;
        }
        .info-row:hover { border-color: #3f3f3f; }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(99,102,241,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #818cf8;
        }

        .info-label {
          font-size: 10px;
          font-weight: 600;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 3px;
        }

        .info-value {
          font-size: 14px;
          color: #e5e7eb;
          word-break: break-word;
        }

        .btn-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .btn {
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-align: center;
        }

        .btn-ghost {
          background: #222;
          color: #e5e7eb;
          border: 1px solid #2a2a2a;
        }
        .btn-ghost:hover { background: #2a2a2a; border-color: #3f3f3f; }

        .btn-indigo {
          background: #6366f1;
          color: white;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }
        .btn-indigo:hover { background: #4f46e5; transform: translateY(-1px); }
      `}</style>

      <div className="profile-root">
        <div className="profile-card">

          {/* ── HEADER ── */}
          <div className="profile-header">
            <div className="deco-circle" />
            <button className="back-btn" onClick={() => navigate("/")}>
              <FaArrowLeftLong size={12} /> Back
            </button>
            <span className="role-pill">
              {isEducator ? "Educator" : "Student"}
            </span>
          </div>

          {/* ── AVATAR + NAME ── */}
          <div className="avatar-zone">
            <div style={{ position: "relative" }}>
              <div className="avatar-ring">
                <div className="avatar-inner">
                  {userData?.photoUrl
                    ? <img src={userData.photoUrl} className="avatar-img" alt="" />
                    : <span className="avatar-letter">{avatarChar}</span>
                  }
                </div>
              </div>
              <div className="avatar-edit" onClick={() => navigate("/editprofile")} title="Edit photo">
                <FaPen size={10} color="white" />
              </div>
            </div>

            <h2 className="profile-name">{userData?.name || "Your Name"}</h2>
            <p className="profile-email-sub">{userData?.email}</p>

            {/* ── STATS ── */}
            <div className="stats-row">
              <div className="stat-cell">
                <div className="stat-val">{courseCount}</div>
                <div className="stat-label">
                  {isEducator ? "Created" : "Enrolled"}
                </div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">
                  {isEducator
                    ? (creatorCourseData?.filter(c => c.isPublished).length ?? 0)
                    : completedCount
                  }
                </div>
                <div className="stat-label">
                  {isEducator ? "Published" : "Completed"}
                </div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).getFullYear()
                    : "—"}
                </div>
                <div className="stat-label">Joined</div>
              </div>
            </div>

            {/* ── INFO ROWS ── */}
            <div className="info-list">
              <div className="info-row">
                <div className="info-icon"><FaEnvelope size={14} /></div>
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-value">{userData?.email || "—"}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon"><FaUserGraduate size={14} /></div>
                <div>
                  <div className="info-label">Bio</div>
                  <div
                    className="info-value"
                    style={{
                      color: userData?.description ? "#e5e7eb" : "#4b5563",
                      fontStyle: userData?.description ? "normal" : "italic"
                    }}
                  >
                    {userData?.description || "No bio added yet"}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon"><FaBookOpen size={14} /></div>
                <div>
                  <div className="info-label">
                    {isEducator ? "Created Courses" : "Enrolled Courses"}
                  </div>
                  <div className="info-value">
                    {isEducator
                      ? (courseCount === 0
                          ? "No courses created yet"
                          : `${courseCount} ${courseCount === 1 ? "course" : "courses"} created`)
                      : (enrolledCount === 0
                          ? "No courses yet"
                          : `${enrolledCount} ${enrolledCount === 1 ? "course" : "courses"} enrolled`)
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* ── BUTTONS ── */}
            <div className="btn-row">
              <button
                className="btn btn-ghost"
                onClick={() => navigate(isEducator ? "/courses" : "/mycourses")}
              >
                My Courses
              </button>
              <button
                className="btn btn-indigo"
                onClick={() => navigate("/editprofile")}
              >
                Edit Profile
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
