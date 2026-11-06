import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong, FaCamera } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditProfile() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [preview, setPreview] = useState(userData?.photoUrl || null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFile = (e) => {
    const file = e.target.files[0];
    setPhotoUrl(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("photoUrl", photoUrl);
    try {
      const result = await axios.post(serverUrl + "/api/user/profile", formData, { withCredentials: true });
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/profile");
      toast.success("Profile Updated");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 480, background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)", padding: "40px 36px" }}>

        <button onClick={() => navigate("/profile")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
          <FaArrowLeftLong /> Back to Profile
        </button>

        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Edit Profile</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>Update your personal information</p>

        {/* Avatar Upload */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => document.getElementById("avatarInput").click()}>
            {preview ? (
              <img src={preview} style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border-hover)" }} alt="" />
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
                {avatarChar}
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: "var(--text-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-card)" }}>
              <FaCamera size={12} color="var(--bg-primary)" />
            </div>
          </div>
          <input id="avatarInput" type="file" accept="image/*" hidden onChange={handleFile} />
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Click to change photo</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Full Name</label>
            <input className="ev-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Email</label>
            <input className="ev-input" type="text" value={userData.email} readOnly style={{ opacity: 0.5, cursor: "not-allowed" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Bio</label>
            <textarea className="ev-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about yourself..." style={{ resize: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate("/profile")}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading} onClick={handleEditProfile}>
              {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
