import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const dropdownRef = useRef(null);

  const isEducator = userData?.role === "educator";

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      setShowDropdown(false);
      setShowMobile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/allcourses" },
    { label: "AI Search", path: "/search" },
  ];

  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();

  const mobileLinkStyle = {
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 16,
    fontWeight: 500,
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "8px 0",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className="nav-bar fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-6 lg:px-12 justify-between"
        style={{ position: "fixed" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="VetrexLearnAI Logo"
            className="w-9 h-9 rounded-lg object-cover"
            style={{ border: "1px solid var(--border)" }}
          />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            VertexLearnAI
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {link.label}
            </button>
          ))}
          {isEducator && (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
            title="Toggle theme"
          >
            <div className="theme-toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </button>

          {/* Auth / Profile */}
          {!userData ? (
            <div className="hidden lg:flex items-center gap-2">
              <button
                className="btn-outline"
                style={{ padding: "8px 20px", fontSize: 14 }}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: 14 }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((p) => !p)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "2px solid var(--border-hover)",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "var(--accent)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
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
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu absolute right-0 mt-2 w-48"
                  style={{ top: "100%" }}
                >
                  {/* User info */}
                  <div
                    style={{
                      padding: "12px 18px 8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {userData.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {userData.role}
                    </div>
                  </div>

                  {/* My Profile */}
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  >
                    👤 My Profile
                  </div>

                  {/* My Courses — educator ke liye /courses, student ke liye /mycourses */}
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate(isEducator ? "/courses" : "/mycourses");
                      setShowDropdown(false);
                    }}
                  >
                    📚 My Courses
                  </div>

                  {/* Wishlist — sirf student ke liye */}
                  {!isEducator && (
                    <div
                      className="dropdown-item"
                      onClick={() => { navigate("/wishlist"); setShowDropdown(false); }}
                    >
                      ♡ My Wishlist
                    </div>
                  )}

                  {/* Learning Roadmap — sirf student ke liye */}
                  {!isEducator && (
                    <div
                      className="dropdown-item"
                      onClick={() => { navigate("/roadmap"); setShowDropdown(false); }}
                    >
                      🗺 Learning Roadmap
                    </div>
                  )}

                  {/* Log Out */}
                  <div
                    className="dropdown-item"
                    onClick={handleLogOut}
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    🚪 Log Out
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setShowMobile(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "var(--text-primary)",
                  borderRadius: 2,
                  transition: "all 0.2s",
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {showMobile && (
        <div
          className="sidebar-overlay fixed inset-0 z-50 lg:hidden"
          onClick={() => setShowMobile(false)}
        >
          <div
            className="mobile-menu absolute right-0 top-0 h-full w-72 p-8 flex flex-col gap-4 animate-slide-down"
            style={{ borderLeft: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowMobile(false)}
              style={{
                alignSelf: "flex-end",
                background: "var(--bg-secondary)",
                border: "none",
                borderRadius: 8,
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              ✕
            </button>

            {/* User info */}
            {userData && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "var(--bg-secondary)",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {userData.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {userData.role}
                </div>
              </div>
            )}

            {/* Nav Links */}
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setShowMobile(false); }}
                style={mobileLinkStyle}
              >
                {link.label}
              </button>
            ))}

            {isEducator && (
              <button
                onClick={() => { navigate("/dashboard"); setShowMobile(false); }}
                style={mobileLinkStyle}
              >
                Dashboard
              </button>
            )}

            {userData && (
              <>
                <button
                  onClick={() => { navigate("/profile"); setShowMobile(false); }}
                  style={mobileLinkStyle}
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() => {
                    navigate(isEducator ? "/courses" : "/mycourses");
                    setShowMobile(false);
                  }}
                  style={mobileLinkStyle}
                >
                  📚 My Courses
                </button>

                {/* Wishlist — sirf student ke liye */}
                {!isEducator && (
                  <button
                    onClick={() => { navigate("/wishlist"); setShowMobile(false); }}
                    style={mobileLinkStyle}
                  >
                    ♡ My Wishlist
                  </button>
                )}

                {/* Roadmap — sirf student ke liye */}
                {!isEducator && (
                  <button
                    onClick={() => { navigate("/roadmap"); setShowMobile(false); }}
                    style={mobileLinkStyle}
                  >
                    🗺 Learning Roadmap
                  </button>
                )}
              </>
            )}

            <div className="mt-auto flex flex-col gap-2">
              {!userData ? (
                <>
                  <button
                    className="btn-outline w-full justify-center"
                    onClick={() => { navigate("/login"); setShowMobile(false); }}
                  >
                    Login
                  </button>
                  <button
                    className="btn-primary w-full justify-center"
                    onClick={() => { navigate("/signup"); setShowMobile(false); }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogOut}
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    borderRadius: 10,
                    padding: "10px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  🚪 Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
