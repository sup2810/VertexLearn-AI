import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaArrowLeftLong, FaLock, FaEnvelope, FaShieldHalved } from "react-icons/fa6";

const steps = ["Send OTP", "Verify OTP", "New Password"];

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/sendotp", { email }, { withCredentials: true });
      setLoading(false);
      setStep(2);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true });
      setLoading(false);
      setStep(3);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== conPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/resetpassword", { email, password: newPassword }, { withCredentials: true });
      setLoading(false);
      navigate("/login");
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  const stepIcons = [<FaEnvelope size={20} />, <FaShieldHalved size={20} />, <FaLock size={20} />];
  const stepTitles = ["Forgot Password", "Verify OTP", "Reset Password"];
  const stepSubtitles = ["Enter your email to receive a verification code", "Enter the 4-digit code sent to your email", "Create a new secure password for your account"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 440, background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)", padding: "40px 36px" }}>

        {/* Step Indicators */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i + 1 <= step ? "var(--text-primary)" : "var(--bg-secondary)", border: `2px solid ${i + 1 <= step ? "var(--text-primary)" : "var(--border-hover)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", fontSize: 12, fontWeight: 700, color: i + 1 <= step ? "var(--bg-primary)" : "var(--text-muted)" }}>
                  {i + 1}
                </div>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: i + 1 < step ? "var(--text-primary)" : "var(--border)", borderRadius: 2, transition: "all 0.3s", maxWidth: 40 }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "var(--accent)" }}>
          {stepIcons[step - 1]}
        </div>

        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>{stepTitles[step - 1]}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>{stepSubtitles[step - 1]}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {step === 1 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Email Address</label>
                <input className="ev-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOtp()} />
              </div>
              <button className="btn-primary" style={{ justifyContent: "center", height: 46 }} disabled={loading} onClick={sendOtp}>
                {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>OTP Code</label>
                <input className="ev-input" type="text" placeholder="* * * *" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} style={{ letterSpacing: "0.3em", fontSize: 20, textAlign: "center" }} onKeyDown={(e) => e.key === "Enter" && verifyOTP()} />
              </div>
              <button className="btn-primary" style={{ justifyContent: "center", height: 46 }} disabled={loading} onClick={verifyOTP}>
                {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>New Password</label>
                <input className="ev-input" type="password" placeholder="Min 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Confirm Password</label>
                <input className="ev-input" type="password" placeholder="Repeat password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && resetPassword()} />
              </div>
              <button className="btn-primary" style={{ justifyContent: "center", height: 46 }} disabled={loading} onClick={resetPassword}>
                {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Reset Password"}
              </button>
            </>
          )}

          <div style={{ textAlign: "center" }}>
            <span onClick={() => navigate("/login")} style={{ fontSize: 13, color: "var(--accent)", cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FaArrowLeftLong size={12} /> Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
