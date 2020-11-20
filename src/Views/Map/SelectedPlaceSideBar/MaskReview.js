import React from "react"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

// components
import MaskRatingIcons from "../../../Components/MaskRatingIcons"

// styles
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo("en-US")

export default review => {
  if (!review.review.length) return
  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.11rem", marginBottom: 9 }}>
        {review.user.username}
      </div>
      <div>
        <MaskRatingIcons
          maskRating={review.rating}
          maskRatingsCount={1}
          styles={ratingStyles}
          widthMultiplier={21}
        />
        <i style={{ fontSize: "0.81rem", color: "#666", marginLeft: 12 }}>
          {timeAgo.format(new Date(review.timestamp))}
        </i>
      </div>
      <div style={{ margin: "12px 0 6px 0", borderLeft: "3px solid #ccc", paddingLeft: 9 }}>{review.review}</div>
    </div>
  )
}
