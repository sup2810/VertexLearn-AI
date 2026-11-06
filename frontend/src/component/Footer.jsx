import React from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const links = [
    { label: "Home", path: "/" },
    { label: "All Courses", path: "/allcourses" },
    { label: "AI Search", path: "/search" },
    { label: "Login", path: "/login" },
    { label: "My Profile", path: "/profile" },
  ];

  const categories = [
    "Web Development",
    "App Development",
    "AI / ML",
    "UI/UX Designing",
    "Data Science",
    "Ethical Hacking",
  ];

  return (
    <footer className="ev-footer" style={{ marginTop: "auto" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 40px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
          >
            <img
              src={logo}
              alt=""
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
            />
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              VetrexLearnAI
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 220,
            }}
          >
            AI-powered learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            Quick Links
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {links.map((link) => (
              <li key={link.path}>
                <span
                  className="ev-link"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            Categories
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map((cat) => (
              <li key={cat}>
                <span
                  className="ev-link"
                  onClick={() => navigate("/allcourses")}
                >
                  {cat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            Platform
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Student Dashboard", "Educator Dashboard", "Course Reviews", "AI Smart Search"].map(
              (item) => (
                <li key={item}>
                  <span className="ev-link">{item}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © {year} VetrexLearnAI. All rights reserved.
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Built with ❤️ for learners
        </span>
      </div>
    </footer>
  );
}

export default Footer;
