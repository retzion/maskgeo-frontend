import React from "react"
import Sidebar from "react-sidebar"

// components
import MaskRatingIcons from "../../../Components/MaskRatingIcons"

// styles
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })
const styles = {
  sidebar: {
    sidebar: {
      background: "white",
      width: "99%",
      maxWidth: 550,
    },
  },
  close: {
    position: "absolute",
    right: 9,
    top: 0,
    cursor: "pointer",
    margin: "0 0 12px 12px",
    fontSize: "2rem",
    textShadow: "2px 2px #ddd",
  },
  container: {
    fontSize: "1rem",
    textAlign: "left",
    minWidth: "240px",
    padding: 12,
  },
  icon: { height: 24, marginRight: 9 },
  title: {
    fontSize: "1.5rem",
    marginBottom: 6,
  },
  ratingText: {
    verticalAlign: "middle",
    display: "inline-block",
    fontSize: "1rem",
    height: 21,
    padding: "0 4.5px",
    color: "#666",
  },
  address: {
    fontSize: "1rem",
  },
  phone: {
    fontSize: "0.9rem",
    marginRight: 15,
  },
  phoneLink: {
    textDecoration: "none",
  },
  reviewButton: { marginLeft: 15 },
  hoursContainer: { paddingBottom: 15 },
  hours: { fontStyle: "italic", fontSize: "0.9rem" },
  website: { textDecoration: "none" },
}

export default ({ close, openProfile, selected, setShowPostReview, user }) => {
  const {
    formatted_address: address,
    formatted_phone_number: phone,
    icon,
    name,
    opening_hours,
    photos = [],
    maskRating,
    maskRatingsCount,
    maskReviews,
    user_ratings_total,
    website,
  } = selected || {}
  const featurePhotoUrl = photos[0] ? photos[0].getUrl() : null

  function reviewLocation() {
    if (!user) openProfile()
    else setShowPostReview(true)
  }

  const SidebarContent = () => (
    <div>
      {featurePhotoUrl && (
        <div
          style={{
            height: 270,
            backgroundImage: `url(${featurePhotoUrl})`,
            backgroundSize: "cover",
          }}
        />
      )}
      <a onClick={close} style={styles.close}>
        ✖️
      </a>
      <div style={styles.container}>
        {/* {Business info} */}
        <h1 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>

        {/* {Rating Icons} */}
        {!maskRatingsCount ? (
          "not yet rated"
        ) : (
          <div className="mask-rating-icons">
            <div style={styles.ratingText}>{maskRating.toFixed(1)}</div>
            <MaskRatingIcons
              maskRating={maskRating}
              maskRatingsCount={maskRatingsCount}
              styles={ratingStyles}
              widthMultiplier={30}
            />
            <div style={styles.ratingText}>
              <i>({maskRatingsCount})</i>
            </div>
          </div>
        )}

        {/* {Address} */}
        <h2 style={styles.address}>{address}</h2>

        {/* {Phone} */}
        <p>
          {phone && (
            <span style={styles.phone}>
              ☎️{" "}
              <a href={`tel:${phone}`} style={styles.phoneLink}>
                {phone}
              </a>
            </span>
          )}
          {website && (
            <a href={website} target="_blank" style={styles.website}>
              🌐 website
            </a>
          )}
        </p>

        {/* {Hours} */}
        {opening_hours && opening_hours.weekday_text && (
          <div style={styles.hoursContainer}>
            <strong>🕘 Hours</strong>
            <div style={styles.hours}>
              {opening_hours.weekday_text.map((day, i) => (
                <div style={{ margin: 0, padding: 0 }} key={i}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* {Mask Forcast starts here} */}
        <hr />
        <h2>Mask Forecast</h2>

        {/* {Reviews} */}
        <h3>
          Reviews
          <button
            className="primary"
            onClick={reviewLocation}
            style={styles.reviewButton}
          >
            Rate &amp; Review
          </button>
        </h3>
        {!maskReviews || !maskReviews.length ? (
          <span>No reviews have been posted yet.</span>
        ) : (
          maskReviews.map(r => {
            if (r.review.length)
              return (
                <div style={{ padding: "6px 0" }}>
                  <strong>{r.user.username}</strong> says: {r.review}
                </div>
              )
          })
        )}

        <p>
          <br />
        </p>
      </div>
    </div>
  )

  return (
    <Sidebar
      sidebar={<SidebarContent />}
      open={true}
      children={[]}
      styles={styles.sidebar}
    />
  )
}
