import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faClock,
  faEnvelope,
  faGlobeAmericas,
  faLink,
  faMapMarkerAlt,
  faPhoneAlt,
  faShareAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import {
  faFacebookF,
  faLinkedinIn,
  faPinterest,
  faReddit,
  faTelegramPlane,
  faTumblr,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

// components
import MaskRatingIcons from "../../../Components/MaskRatingIcons"
import MaskReview from "./MaskReview"
import Sidebar from "../../../Components/Sidebar"
import PostReview from "../PostReview"

// helpers
import { websiteSettings } from "../../../config"

// images & styles
import logo from "../../../assets/img/logo-w-text-horz.png"
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
    reference,
    vicinity,
    website,
  } = selected || {}

  const featurePhotoUrl = photos[0] ? photos[0].getUrl() : null

  const [showPostReview, setShowPostReview] = useState(null)

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

      {!featurePhotoUrl && <h3>&nbsp;</h3>}
      <div style={styles.container}>
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

  const SidebarControls = () => {
    const baseUrl = `${document.location.protocol}//${document.location.host}/selected/${reference}?details`
    const [showShareOptions, setShowShareOptions] = useState(null)
    const [clipboard, setClipboard] = useState({
      value: baseUrl,
      copied: false,
    })

    const shareText = `Mask Forecast for ${name}, ${vicinity}`
    const shareUrl = encodeURIComponent(window.location)
    const shareImage = encodeURIComponent(
      window.location + "img/logo-w-text.png"
    )
    const platformUrls = {
      email: `mailto:?subject=${shareText}&body=${shareText} ${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?href=${shareUrl}`,
      linkedin: `https://www.linkedin.com/shareArticle?url=${shareUrl}&mini=true`,
      pinterest: `https://www.pinterest.com/pin-builder/?url=${shareUrl}&media=${shareImage}&method=button`,
      reddit: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
      telegram: `https://telegram.me/share/?url=${shareUrl}&text=${shareText}`,
      tumblr: `https://www.tumblr.com/widgets/share/tool/preview?canonicalUrl=${shareUrl}&title=${shareText}&posttype=link`,
      twitter: `https://twitter.com/share?url=${shareUrl}&text=${shareText}`,
      whatsapp: `https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`,
    }

    function openShareWindow(platform) {
      const outerHeight = window.outerHeight
      const outerWidth = window.outerWidth
      const reduceWindowSize = outerWidth > 550 && outerWidth * 0.75 > 550
      const height = reduceWindowSize ? outerHeight * 0.81 : outerHeight
      const width = reduceWindowSize ? outerWidth * 0.75 : outerWidth
      const openerConfig = {
        height,
        width,
        top: reduceWindowSize ? outerHeight * 0.1012 : 0,
        left: reduceWindowSize ? outerWidth * 0.1125 : 0,
        location: "no",
        toolbar: "no",
        status: "no",
        directories: "no",
        menubar: "no",
        scrollbars: "yes",
        resizable: "no",
        centerscreen: "yes",
        chrome: "yes",
      }

      window.open(
        platformUrls[platform],
        null,
        Object.keys(openerConfig)
          .map(key => `${key}=${openerConfig[key]}`)
          .join(", ")
      )
    }

    const ShareOptions = () => (
      <div className="share-options">
        <button
          className="top-button right-button share-cancel"
          onClick={() => {
            setShowShareOptions(false)
          }}
        >
          <span>Done</span>
        </button>

        <h3 className="share-location">
          Share This Location&nbsp;&nbsp;&nbsp;
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={faShareAlt} />
          </span>
        </h3>

        <div className="share-buttons">
          <button
            className="top-button share-button share-facebook"
            onClick={() => {
              openShareWindow("facebook")
            }}
          >
            <span>Facebook</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faFacebookF} />
            </span>
          </button>

          <button
            className="top-button share-button share-linkedin"
            onClick={() => {
              openShareWindow("linkedin")
            }}
          >
            <span>LinkedIn</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faLinkedinIn} />
            </span>
          </button>

          <button
            className="top-button share-button share-pinterest"
            onClick={() => {
              openShareWindow("pinterest")
            }}
          >
            <span>Pinterest</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faPinterest} />
            </span>
          </button>

          <button
            className="top-button share-button share-reddit"
            onClick={() => {
              openShareWindow("reddit")
            }}
          >
            <span>Reddit</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faReddit} />
            </span>
          </button>

          <button
            className="top-button share-button share-telegram"
            onClick={() => {
              openShareWindow("telegram")
            }}
          >
            <span>Telegram</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTelegramPlane} />
            </span>
          </button>

          <button
            className="top-button share-button share-twitter"
            onClick={() => {
              openShareWindow("twitter")
            }}
          >
            <span>Twitter</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTwitter} />
            </span>
          </button>

          <button
            className="top-button share-button share-tumblr"
            onClick={() => {
              openShareWindow("tumblr")
            }}
          >
            <span>Tumblr</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTumblr} />
            </span>
          </button>

          <button
            className="top-button share-button share-whatsapp"
            onClick={() => {
              openShareWindow("whatsapp")
            }}
          >
            <span>Whatsapp</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faWhatsapp} />
            </span>
          </button>

          <button
            className="top-button share-button share-email"
            onClick={() => {
              openShareWindow("email")
            }}
          >
            <span>Email</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faEnvelope} />
            </span>
          </button>

          <input
            style={{ visibility: "hidden", position: "absolute" }}
            value={clipboard.value}
            onChange={({ target: { value } }) =>
              setClipboard({ value, copied: false })
            }
          />
          <CopyToClipboard
            text={clipboard.value}
            onCopy={() => {
              setClipboard({ ...clipboard, copied: true })
              setTimeout(() => {
                setClipboard({ ...clipboard, copied: false })
              }, 2500)
            }}
          >
            <button className="top-button share-button copy-url">
              <span>{clipboard.copied ? " Copied! " : "Copy Link"}</span>
              <span className="icon-container">
                <FontAwesomeIcon
                  className="icon"
                  icon={clipboard.copied ? faCheck : faLink}
                />
              </span>
            </button>
          </CopyToClipboard>
        </div>
      </div>
    )

    return (
      <React.Fragment>
        {!showShareOptions && (
          <a onClick={close} className="top-button close">
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTimes} />
            </span>
          </a>
        )}

        {showShareOptions && <ShareOptions />}
        {!showShareOptions && (
          <button
            className="top-button right-button share-button share"
            onClick={() => {
              setShowShareOptions(true)
            }}
          >
            <span>Share</span>
            <span className="icon-container">
              <FontAwesomeIcon className="icon" icon={faShareAlt} />
            </span>
          </button>
        )}
        {!showShareOptions && <img src={logo} alt={websiteSettings.friendlyName} className="logo" />}
      </React.Fragment>
    )
  }

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
        ) : (
          <SidebarContent />
        )
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
          <SidebarControls />
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
