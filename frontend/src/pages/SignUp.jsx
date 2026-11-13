
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const googleSignUpInProgress = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Signup Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await getRedirectResult(auth);
        if (!response || !active) return;
        const user = response.user;
        const savedRole = sessionStorage.getItem("vertexGoogleSignupRole") || "student";
        sessionStorage.removeItem("vertexGoogleSignupRole");
        const result = await axios.post(serverUrl + "/api/auth/googleauth",
          { name: user.displayName, email: user.email, role: savedRole },
          { withCredentials: true });
        if (!active) return;
        dispatch(setUserData(result.data));
        toast.success("Google signup successful");
        navigate("/");
      } catch (error) {
        console.error("Google redirect signup error:", error);
        if (active && error.code !== "auth/no-auth-event")
          toast.error(error.response?.data?.message || error.message || "Google signup failed");
      }
    })();
    return () => { active = false; };
  }, [dispatch, navigate]);

  const googleSignUp = async () => {
    if (googleSignUpInProgress.current || loading) return;
    googleSignUpInProgress.current = true;
    setLoading(true);
    try {
      sessionStorage.setItem("vertexGoogleSignupRole", role);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google redirect signup start error:", error);
      toast.error(error.message || "Could not start Google signup");
      googleSignUpInProgress.current = false;
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
          // FIX 1: bg-secondary instead of bg-card so right panel has visible contrast
          background: "var(--bg-secondary)",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          minHeight: 580,
        }}
      >
        {/* ── Left Panel ── */}
        <div
          className="hidden md:flex"
          style={{
            width: 300,
            // FIX 2: hardcoded deep dark bg so it always looks like a dark accent panel
            // regardless of light/dark mode — matches the screenshot's intent
            background: "#1a1a2e",
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
            style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover" }}
          />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Join VetrexLearnAI
          </span>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Start your learning journey today. Access 50+ expert-led courses.
          </p>

          {/* Role Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 12 }}>
            {[
              { r: "student", emoji: "🎓", label: "I want to learn" },
              { r: "educator", emoji: "🏫", label: "I want to teach" },
            ].map(({ r, emoji, label }) => (
              <div
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: `1px solid ${role === r ? "rgba(108,99,255,0.8)" : "rgba(255,255,255,0.1)"}`,
                  background: role === r ? "rgba(108,99,255,0.25)" : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", textTransform: "capitalize" }}>
                    {r === "student" ? "Student" : "Educator"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div
          style={{
            flex: 1,
            // FIX 3: explicit white/dark card bg so it separates from outer wrapper
            background: "var(--bg-card)",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
            // subtle left border to visually separate panels
            borderLeft: "1px solid var(--border)",
          }}
        >
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
              Create account
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15, margin: 0 }}>
              Join thousands of learners worldwide
            </p>
          </div>

          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Full Name</label>
            <input
              className="ev-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Email</label>
            <input
              className="ev-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="ev-input"
                type={show ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShow((p) => !p)}
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer",
                  color: "var(--text-muted)", display: "flex",
                }}
              >
                {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Role Toggle — mobile only */}
          <div className="flex md:hidden gap-3">
            {["student", "educator"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: `1px solid ${role === r ? "var(--accent)" : "var(--border)"}`,
                  background: role === r ? "var(--accent)" : "var(--bg-secondary)",
                  color: role === r ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* FIX 4: Create Account button — solid contrast colors that work in both modes */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              height: 46,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Syne, sans-serif",
              // Always dark bg + white text — visible in both light and dark mode
              background: loading ? "var(--border)" : "#1a1a2e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#2d2b55"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a1a2e"; }}
          >
            {loading ? <ClipLoader size={22} color="#ffffff" /> : "Create Account"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Google Button */}
          <button
            className="btn-outline"
            style={{ justifyContent: "center", height: 46 }}
            onClick={googleSignUp}
            disabled={loading}
          >
            <img src={google} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
