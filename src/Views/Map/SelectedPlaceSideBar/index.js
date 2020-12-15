import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClock,
  faGlobeAmericas,
  faMapMarkerAlt,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons"

// components
import Loader from "../../../Components/Loader"
import MaskRatingIcons from "../../../Components/MaskRatingIcons"
import MaskReview from "./MaskReview"
import Sidebar from "../../../Components/Sidebar"
import PostReview from "../PostReview"
import SidebarControls from "./SidebarControls"

// images & styles
import styles from "./styles"
import "./styles/index.css"
import "./styles/label.css"
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })

export default ({
  close: closeSidebar,
  openProfile,
  selected,
  setSelected,
  user,
}) => {
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
    maskReviewsCount = 0,
    website,
  } = selected || {}

  const featurePhotoUrl = photos[0] ? photos[0].getUrl() : null

  const [scrolledBelowImage, setScrolledBelowImage] = useState(null)
  const [showPostReview, setShowPostReview] = useState(null)

  React.useEffect(() => {
    const scrollYTrigger = featurePhotoUrl ? 245 : 0
    const sidebar = document.getElementById("selected_place_sidebar")
    const scrollPane = sidebar.getElementsByClassName("sidebar-content")[0]
    if (name && !featurePhotoUrl) setScrolledBelowImage(true)
    scrollPane.addEventListener("scroll", ({ target }) => {
      if (!featurePhotoUrl || (target.scrollTop > scrollYTrigger)) setScrolledBelowImage(true)
      else setScrolledBelowImage(null)
    })
  }, [])

  React.useEffect(() => {
    if (window.location.hash) {
      const sidebar = document.getElementById("selected_place_sidebar")
      const reviewsPane = sidebar.getElementsByClassName("sidebar-content")[0]
      setTimeout(() => {
        const a = window.location.hash.substring(1)
        const b = document.getElementById(a)
        if (a && b) reviewsPane.scroll(0, findPos(b))
      }, 333)
    }
  }, [window.location.hash])

  // parse hours
  let openNow, todaysHours, todaysHoursText
  try {
    openNow = opening_hours && opening_hours.isOpen()
    todaysHours =
      opening_hours && opening_hours.periods
        ? opening_hours.periods.find(p => p.open.day === new Date().getDay())
        : null
    todaysHoursText =
      todaysHours && todaysHours.open && todaysHours.open.time
        ? openNow
          ? `${militaryTimeToAmPm(
              todaysHours.open.time
            )} - ${militaryTimeToAmPm(todaysHours.close.time)}`
          : `Opens at ${militaryTimeToAmPm(todaysHours.open.time)}`
        : null
  } catch (c) {}

  function close() {
    window.location.hash = ""
    closeSidebar()
  }

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
    else {
      setShowPostReview(true)
      document.getElementsByClassName("sidebar-content")[0].scroll({ top: 0 })
    }
  }

  const SidebarContent = () => (
    <div className="selected-place-sidebar open-sidebar">
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

      <div style={{ ...styles.container, marginTop: featurePhotoUrl ? 0 : 36 }}>
        {/* {Business info} */}
        <h1 className="place-name-header">
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>

        {/* Ratings / Leave Review */}
        <div className="mask-rating-icons-row">
          {/* {Rating Icons} */}
          {!maskRatingsCount ? (
            <div className="mask-ratings" style={styles.sidePadding}>
              <i>not yet rated</i>
            </div>
          ) : (
            <div className="mask-ratings" style={styles.sidePadding}>
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

          {/* Leave Review */}
          <button className="primary float-right" onClick={reviewLocation}>
            Rate &amp; Review
          </button>
        </div>

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
          Mask Reviews <i>({maskReviewsCount})</i>
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

  return (
    <Sidebar
      close={close}
      sidebarId="selected_place_sidebar"
      sidebarContent={
        showPostReview ? (
          <PostReview
            user={user}
            selected={selected}
            close={() => {
              setShowPostReview(null)
            }}
            setSelected={setSelected}
          />
        ) : selected.name ? (
          <SidebarContent />
        ) : <Loader />
      }
      sidebarControls={
        showPostReview ? (
          <a
            onClick={() => {
              setShowPostReview(null)
            }}
            className="top-button close"
          >
            ✖️
          </a>
        ) : (
          <SidebarControls
            close={close}
            featurePhotoUrl={featurePhotoUrl}
            selected={selected}
            scrolledBelowImage={scrolledBelowImage}
          />
        )
      }
      startOpen={true}
      zIndex={2}
    />
  )
}

//Finds y value of given object
function findPos(obj) {
  if (!obj) return
  var curtop = 0
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop
    } while ((obj = obj.offsetParent))
    return [curtop]
  }
}
