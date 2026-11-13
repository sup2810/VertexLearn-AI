
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const googleLoginInProgress = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await getRedirectResult(auth);
        if (!response || !active) return;
        const user = response.user;
        const result = await axios.post(serverUrl + "/api/auth/googleauth",
          { name: user.displayName, email: user.email, role: "" },
          { withCredentials: true });
        if (!active) return;
        dispatch(setUserData(result.data));
        toast.success("Login Successfully");
        navigate("/");
      } catch (error) {
        console.error("Google redirect login error:", error);
        if (active && error.code !== "auth/no-auth-event")
          toast.error(error.response?.data?.message || error.message || "Google Login Failed");
      }
    })();
    return () => { active = false; };
  }, [dispatch, navigate]);

  const googleLogin = async () => {
    if (googleLoginInProgress.current || loading) return;
    googleLoginInProgress.current = true;
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google redirect start error:", error);
      toast.error(error.message || "Could not start Google sign-in");
      googleLoginInProgress.current = false;
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
          maxWidth: 880,
          display: "flex",
          // FIX 1: bg-secondary so left form panel gets visible contrast against wrapper
          background: "var(--bg-secondary)",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          minHeight: 540,
        }}
      >
        {/* ── Left Form Panel ── */}
        <div
          style={{
            flex: 1,
            // FIX 2: explicit bg-card so it stands out from the bg-secondary wrapper
            background: "var(--bg-card)",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            // subtle right border to separate from right panel
            borderRight: "1px solid var(--border)",
          }}
        >
          {/* Back */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 14,
              marginBottom: 4,
              alignSelf: "flex-start",
            }}
          >
            <FaArrowLeftLong /> Back
          </button>

          <div style={{ marginBottom: 4 }}>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 4,
                marginTop: 0,
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15, margin: 0 }}>
              Login to continue your learning journey
            </p>
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              className="ev-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="ev-input"
                type={show ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShow((p) => !p)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: "right", marginTop: -10 }}>
            <span
              onClick={() => navigate("/forget")}
              style={{
                fontSize: 13,
                color: "var(--accent)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </span>
          </div>

          {/* FIX 3: Login button — hardcoded dark bg + white text, visible in both modes */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              height: 46,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Syne, sans-serif",
              background: loading ? "var(--border)" : "#1a1a2e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#2d2b55"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a1a2e"; }}
          >
            {loading ? <ClipLoader size={22} color="#ffffff" /> : "Login"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Google */}
          <button
            className="btn-outline"
            style={{ justifyContent: "center", height: 46 }}
            onClick={googleLogin}
            disabled={loading}
            style={{ justifyContent: "center", height: 46, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            <img src={google} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* ── Right Panel — always light cream, hidden on mobile ── */}
        <div
          className="hidden md:flex"
          style={{
            width: 320,
            // FIX 4: hardcoded light cream bg — always light regardless of theme
            // matches the screenshot's intent: right = light brand panel
            background: "#f0ede8",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 40,
            flexShrink: 0,
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover" }}
          />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              // always dark text on light bg
              color: "#1a1a2e",
              textAlign: "center",
            }}
          >
            VetrexLearnAI
          </span>
          <p
            style={{
              fontSize: 14,
              color: "#6b6b7a",
              textAlign: "center",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Learn from world-class instructors. Build real skills. Advance your career.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            {[["50+", "Courses"], ["1k+", "Students"], ["4.8★", "Rating"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  // always dark on light panel
                  color: "#1a1a2e",
                }}>
                  {val}
                </div>
                <div style={{ fontSize: 11, color: "#9999aa", marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
