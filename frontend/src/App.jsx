import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
export const serverUrl = "https://eduverse-bgfe-yti0.onrender.com";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourses from "./pages/Educator/CreateCourses";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import EditCourse from "./pages/Educator/EditCourse";
import getPublishedCourse from "./customHooks/getPublishedCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from "./component/ScrollToTop";
import ViewLectures from "./pages/ViewLectures";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from "./customHooks/getAllReviews";
import SearchWithAi from "./pages/SearchWithAi";
import { ThemeProvider } from "./context/ThemeContext";
import CursorGradient from "./component/CursorGradient";
import StudentDashboard from "./pages/StudentDashboard";
import RoadmapPage from "./pages/RoadmapPage";
import QuizPage from "./pages/QuizPage";
import NotesPage from "./pages/NotesPage";
import WishlistPage from "./pages/WishlistPage";

// ── Route Guards ────────────────────────────────────────────
// BUG FIX: userData null hone par redirect mat karo — loading ka wait karo
function PrivateRoute({ children }) {
  const { userData, loading } = useSelector((state) => state.user);
  if (loading) return null; // ya spinner
  return userData ? children : <Navigate to="/login" />;
}

function EducatorRoute({ children }) {
  const { userData, loading } = useSelector((state) => state.user);
  if (loading) return null;
  if (!userData) return <Navigate to="/login" />;
  if (userData.role !== "educator") return <Navigate to="/" />;
  return children;
}
// ───────────────────────────────────────────────────────────

function AppRoutes() {
  getCurrentUser();
  getCreatorCourse();
  getPublishedCourse();
  getAllReviews();

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CursorGradient />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          boxShadow: "var(--shadow-hover)",
          fontSize: 14,
        }}
      />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />

        {/* Student routes */}
        <Route path="/profile"        element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/editprofile"    element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/allcourses"     element={<PrivateRoute><AllCourses /></PrivateRoute>} />
        <Route path="/viewcourse/:courseId" element={<PrivateRoute><ViewCourse /></PrivateRoute>} />
        <Route path="/viewlecture/:courseId" element={<PrivateRoute><ViewLectures /></PrivateRoute>} />
        <Route path="/mycourses" element={<PrivateRoute>{userData?.role === "educator" ? <Navigate to="/courses" /> : <MyEnrolledCourses />}</PrivateRoute>} />
        <Route path="/search"         element={<PrivateRoute><SearchWithAi /></PrivateRoute>} />
        <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/roadmap"        element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
        <Route path="/quiz/:courseId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/notes/:courseId" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
        <Route path="/wishlist"       element={<PrivateRoute><WishlistPage /></PrivateRoute>} />

        {/* Educator routes */}
        <Route path="/dashboard"      element={<EducatorRoute><Dashboard /></EducatorRoute>} />
        <Route path="/courses"        element={<EducatorRoute><Courses /></EducatorRoute>} />
        <Route path="/createcourse"   element={<EducatorRoute><CreateCourses /></EducatorRoute>} />
        <Route path="/editcourse/:courseId"  element={<EducatorRoute><EditCourse /></EducatorRoute>} />
        <Route path="/createlecture/:courseId" element={<EducatorRoute><CreateLecture /></EducatorRoute>} />
        <Route path="/editlecture/:courseId/:lectureId" element={<EducatorRoute><EditLecture /></EducatorRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
