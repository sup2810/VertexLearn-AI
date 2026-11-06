import React from 'react'
import { FaStar, FaRegStar } from "react-icons/fa"
import img from "../assets/empty.jpg"

function ReviewCard({ comment, rating, photoUrl, name, description, courseTitle }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "24px",
      maxWidth: 340,
      width: "100%",
      boxShadow: "var(--shadow)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-hover)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow)"}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 3 }}>
        {Array(5).fill(0).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 15 }}>
            {i < rating ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>

      {/* Course + Comment */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          Course: <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{courseTitle}</span>
        </p>
        <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.6 }}>
          "{comment}"
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Reviewer Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }}
          />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "#6c63ff", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700,
          }}>
            {name?.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{name}</h3>
          {description && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
