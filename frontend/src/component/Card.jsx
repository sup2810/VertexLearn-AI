
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Card({ thumbnail, title, category, price, id, reviews }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate average review
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);

  // Navigate to course details
  const handleCardClick = () => {
    navigate(`/viewcourse/${id}`);
  };

  return (
    <div
      className="course-card"
      style={{
        width: "100%",
        maxWidth: 320,
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div
        style={{
          overflow: "hidden",
          height: 192,
          width: "100%",
          position: "relative",
          background: "var(--bg-secondary)",
        }}
      >
        {thumbnail && !imageError ? (
          <>
            {!imageLoaded && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 35,
                }}
              >
                📚
              </div>
            )}

            <img
              key={thumbnail}
              src={thumbnail}
              alt={title || "Course thumbnail"}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.error(
                  "Course thumbnail failed to load:",
                  thumbnail
                );
                setImageError(true);
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imageLoaded ? "block" : "none",
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              fontSize: 40,
            }}
          >
            📚
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              No thumbnail available
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
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
            {category || "General"}
          </span>
        </div>
      </div>

      {/* Course Details */}
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
          {title || "Untitled Course"}
        </h3>

        {/* Price and Rating */}
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
            {price > 0 ? `₹${price}` : "Free"}
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
            <FaStar
              className="star-gold"
              style={{ fontSize: 13 }}
            />

            {avgRating}

            {reviews?.length > 0 && (
              <span
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 400,
                }}
              >
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
