import React from "react"
import Sidebar from "react-sidebar"

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
  title: {
    fontSize: "1.5rem",
  },
  icon: { height: 24, marginRight: 9 },
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
  ratingContainer: {
    width: 150,
    height: 30,
    // margin: "auto",
    backgroundImage: "url(/mask-grey.svg)",
    backgroundPosition: "contain",
    backgroundRepeat: "repeat-x",
    textAlign: "left",
  },
  ratingResults: {
    height: 30,
    margin: 0,
    backgroundImage: "url(/mask.svg)",
    backgroundPosition: "contain",
    backgroundRepeat: "repeat-x",
  },
  ratingText: {
    fontStyle: "italic",
    fontSize: "0.75rem",
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
    rating = 0,
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
        <h1 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>
        <h2 style={styles.address}>{address}</h2>
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
        <hr />
        <h2>Mask Forecast</h2>
        {!user_ratings_total ? (
          "not yet rated"
        ) : (
          <React.Fragment>
            <div style={styles.ratingContainer}>
              <div
                style={{
                  ...styles.ratingResults,
                  width: rating * 30,
                }}
              ></div>
            </div>
            <span style={styles.ratingText}>
              {rating} / 5 masks <i>({user_ratings_total} ratings)</i>
            </span>
          </React.Fragment>
        )}
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
        No reviews have been posted yet.
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
