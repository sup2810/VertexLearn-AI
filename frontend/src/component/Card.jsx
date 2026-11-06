import React from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Card({ thumbnail, title, category, price, id, reviews }) {
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);
  const navigate = useNavigate();

  return (
    <div
      className="course-card"
      style={{ width: "100%", maxWidth: 320 }}
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail */}
      <div style={{ overflow: "hidden", height: 192, position: "relative" }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="card-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            📚
          </div>
        )}

        {/* Category badge overlay */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              color: "#333",
              border: "none",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}
        >
          <span className="price-badge">
            {price ? `₹${price}` : "Free"}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-secondary)",
            }}
          >
            <FaStar className="star-gold" style={{ fontSize: 13 }} />
            {avgRating}
            {reviews?.length > 0 && (
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                ({reviews.length})
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
