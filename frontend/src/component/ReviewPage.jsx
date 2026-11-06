import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard'

function ReviewPage() {
  const { reviewData } = useSelector(state => state.review)
  const [latestReview, setLatestReview] = useState(null)

  useEffect(() => {
    setLatestReview(reviewData?.slice(0, 6))
  }, [reviewData])

  if (!latestReview || latestReview.length === 0) return null

  return (
    <div style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 640 }}>
        <div style={{
          display: "inline-block", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 12,
        }}>
          Student Reviews
        </div>
        <h2 style={{
          fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800,
          color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1.2,
        }}>
          Real Reviews for Real Courses
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
          Discover how our Virtual Courses is transforming learning experiences through real feedback from students and professionals worldwide.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        justifyContent: "center",
        maxWidth: 1100,
        width: "100%",
      }}>
        {latestReview.map((review, index) => (
          <ReviewCard
            key={index}
            comment={review.comment}
            rating={review.rating}
            photoUrl={review.user?.photoUrl}
            courseTitle={review.course?.title}
            description={review.user?.description}
            name={review.user?.name}
          />
        ))}
      </div>
    </div>
  )
}

export default ReviewPage
