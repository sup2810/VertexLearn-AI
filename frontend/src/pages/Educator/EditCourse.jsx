import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeftLong, FaCamera, FaTrash } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";

const CATEGORIES = ["App Development", "AI/ML", "AI Tools", "Data Science", "Data Analytics", "Ethical Hacking", "UI UX Designing", "Web Development", "Others"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const thumb = useRef();
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  const [isPublished, setIsPublished] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    const getCourseById = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true });
        setSelectCourse(result.data);
      } catch (e) {}
    };
    getCourseById();
  }, []);

  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(selectCourse.thumbnail || img);
      setIsPublished(selectCourse.isPublished);
    }
  }, [selectCourse]);

  const handleEditCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("thumbnail", backendImage);
    formData.append("isPublished", isPublished);
    try {
      const result = await axios.post(serverUrl + `/api/course/editcourse/${courseId}`, formData, { withCredentials: true });
      const updateData = result.data;
      if (updateData.isPublished) {
        const updated = courseData.map((c) => (c._id === courseId ? updateData : c));
        if (!courseData.some((c) => c._id === courseId)) updated.push(updateData);
        dispatch(setCourseData(updated));
      } else {
        dispatch(setCourseData(courseData.filter((c) => c._id !== courseId)));
      }
      navigate("/courses");
      toast.success("Course Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/remove/${courseId}`, { withCredentials: true });
      dispatch(setCourseData(courseData.filter((c) => c._id !== courseId)));
      navigate("/courses");
      toast.success("Course Removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <button onClick={() => navigate("/courses")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>
              <FaArrowLeftLong /> My Courses
            </button>
            <div className="section-label" style={{ marginBottom: 6 }}>Edit Course</div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>Course Details</h1>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* BUG FIX: selectCourse?._id ki jagah courseId directly use karo */}
            <button onClick={() => navigate(`/createlecture/${courseId}`)} className="btn-outline" style={{ fontSize: 14 }}>Manage Lectures</button>
            <button onClick={() => setIsPublished((p) => !p)} style={{ padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: isPublished ? "rgba(255,107,107,0.12)" : "rgba(67,233,123,0.12)", color: isPublished ? "#dc2626" : "#16a34a", transition: "all 0.2s" }}>
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Thumbnail */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Course Thumbnail</div>
            <div style={{ position: "relative", width: 280, height: 170, cursor: "pointer" }} onClick={() => thumb.current.click()}>
              <img src={frontendImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 32, height: 32, background: "var(--text-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaCamera size={13} color="var(--bg-primary)" />
              </div>
            </div>
            <input type="file" hidden ref={thumb} accept="image/*" onChange={handleThumbnail} />
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Title</label>
            <input className="ev-input" type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Subtitle</label>
            <input className="ev-input" type="text" placeholder="Course Subtitle" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Description</label>
            <textarea className="ev-input" rows={4} placeholder="Describe what students will learn..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: "none" }} />
          </div>

          {/* Category / Level / Price */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Category</label>
              <select className="ev-input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Level</label>
              <select className="ev-input" value={level} onChange={(e) => setLevel(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">Select Level</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Price (₹)</label>
              <input className="ev-input" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button className="btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate("/courses")}>Cancel</button>
            <button className="btn-primary" style={{ flex: 2, justifyContent: "center" }} disabled={loading} onClick={handleEditCourse}>
              {loading ? <ClipLoader size={20} color="var(--bg-primary)" /> : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Danger Zone</div>
            <button onClick={handleRemoveCourse} disabled={loading1} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 12, padding: "12px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
              {loading1 ? <ClipLoader size={18} color="#ef4444" /> : <><FaTrash size={13} /> Remove Course</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
