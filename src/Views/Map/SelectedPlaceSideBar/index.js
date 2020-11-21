import React from "react"
import Sidebar from "react-sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClock,
  faGlobeAmericas,
  faMapMarkerAlt,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons"

// components
import MaskRatingIcons from "../../../Components/MaskRatingIcons"
import MaskReview from "./MaskReview"

// styles
import styles from "./styles"
import "./styles/index.css"
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })

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
    maskReviews = [],
    website,
  } = selected || {}
  const featurePhotoUrl = photos[0] ? photos[0].getUrl() : null

  // parse hours
  const openNow = opening_hours && opening_hours.isOpen()
  const todaysHours = opening_hours && opening_hours.periods
    ? opening_hours.periods.find(p => p.open.day === new Date().getDay())
    : null
  const todaysHoursText = todaysHours
    ? openNow
      ? `${militaryTimeToAmPm(todaysHours.open.time)} - ${militaryTimeToAmPm(
          todaysHours.close.time
        )}`
      : `Opens at ${militaryTimeToAmPm(todaysHours.open.time)}`
    : null

  function militaryTimeToAmPm(time) {
    let hours = time.substring(0, 2)
    const amPm = parseInt(hours) < 12 ? "AM" : "PM"
    hours = parseInt(hours) > 12 ? String(parseInt(hours) - 12) : hours
    if (hours.charAt(0) === "0") hours = hours.substring(1)
    let minutes = time.substring(2)
    minutes = minutes != "00" ? `:${minutes}` : ""
    return `${hours}${minutes}${amPm}`
  }

  function truncateString(str, num) {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + "..."
  }

  function reviewLocation() {
    if (!user) openProfile()
    else setShowPostReview(true)
  }

  const SidebarContent = () => (
    <div className="selected-place-sidebar">
      {featurePhotoUrl && (
        <div
          style={{
            height: 270,
            width: "100%",
            backgroundImage: `url(${featurePhotoUrl})`,
            backgroundSize: "cover",
          }}
        />
      )}
      <a onClick={close} className="close" style={styles.close}>
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
          <div style={styles.sidePadding}>not yet rated</div>
        ) : (
          <div style={styles.sidePadding}>
            <div style={styles.ratingText}>{maskRating.toFixed(1)}</div>
            <MaskRatingIcons
              maskRating={maskRating}
              maskRatingsCount={maskRatingsCount}
              styles={ratingStyles}
              widthMultiplier={21}
            />
            <div style={styles.ratingText}>({maskRatingsCount})</div>
          </div>
        )}

        {/* {Address} */}
        {/* <h2 style={styles.address}>{address}</h2> */}

        {/* {Phone, web, Hours} */}
        <div style={styles.locationDetails}>
          <span className="location-detail">
            <span style={styles.iconBox}>
              <FontAwesomeIcon
                className="icon"
                icon={faMapMarkerAlt}
                style={styles.locationDetailIcon}
              />
            </span>
            {address}
          </span>
          {opening_hours && opening_hours.weekday_text && (
            <a
              href="#"
              className="location-detail"
              onClick={() => {
                alert(
                  "Hours:\n" + opening_hours.weekday_text.map(day => `${day} `)
                )
              }}
            >
              <span style={styles.iconBox}>
                <FontAwesomeIcon
                  className="icon"
                  icon={faClock}
                  style={styles.locationDetailIcon}
                />
              </span>
              {openNow ? (
                "Open now: "
              ) : (
                <span style={{ color: "red" }}>Closed. </span>
              )}
              {todaysHoursText}
            </a>
          )}
          {website && (
            <a href={website} target="_blank" className="location-detail">
              <span style={styles.iconBox}>
                <FontAwesomeIcon
                  className="icon"
                  icon={faGlobeAmericas}
                  style={styles.locationDetailIcon}
                />
              </span>
              {truncateString(website, 36)}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="location-detail">
              <span style={styles.iconBox}>
                <FontAwesomeIcon
                  className="icon"
                  icon={faPhoneAlt}
                  style={styles.locationDetailIcon}
                />
              </span>
              {phone}
            </a>
          )}
        </div>

        {/* {Reviews} */}
        <h3
          style={{
            borderTop: "1px solid #eaeaea",
            padding: "21px 12px 0 12px",
            fontSize: "1.23rem",
          }}
        >
          <button
            className="primary"
            onClick={reviewLocation}
            style={styles.reviewButton}
          >
            <FontAwesomeIcon
              className="icon"
              icon={faThumbsUp}
              style={{ marginRight: 6 }}
            />
            <FontAwesomeIcon
              className="icon"
              icon={faThumbsDown}
              flip="horizontal"
              style={{ marginRight: 6 }}
            />
            Rate &amp; Review
          </button>
          Mask Reviews <i>({maskReviews && maskReviews.length})</i>
        </h3>
        <div style={{ borderTop: "1px solid #eaeaea" }}>
          {!maskReviews || !maskReviews.length ? (
            <div style={styles.padding}>No reviews have been posted yet.</div>
          ) : (
            maskReviews.map(MaskReview)
          )}
        </div>

        <p>
          <br />
        </p>
      </div>
    </div>
  )

  return <Sidebar sidebar={<SidebarContent />} open={true} children={[]} styles={styles.sidebar} />
}
