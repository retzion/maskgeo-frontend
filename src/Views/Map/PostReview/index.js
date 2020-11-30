import React, { createRef, useCallback, useRef, useState } from "react"
import Sidebar from "react-sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

// components
import Slider from "./Slider"

// helpers
import { postReview } from "../../../util/MaskGeoApi"
import calculateMaskRating from "../../../util/calculateMaskRating"

//styles
import "./index.css"
const styles = {
  sidebar: {
    sidebar: {
      background: "white",
      width: "100%",
      maxWidth: 550,
    },
  },
  container: {
    fontSize: "1rem",
    textAlign: "left",
    minWidth: "240px",
  },
  title: {
    fontSize: "1.2rem",
    margin: 0,
  },
  icon: { height: 24, marginRight: 9 },
  address: {
    marginTop: 12,
    fontSize: "0.9rem",
    fontWeight: 450,
    fontStyle: "italic",
  },
  button: { padding: "15px 21px", fontSize: "1rem" },
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
}

export default ({ close, selected, setSelected, user }) => {
  const {
    formatted_address: address,
    formatted_phone_number: phone,
    geometry: { location },
    icon,
    maskRating,
    maskRatingsCount,
    maskReviews,
    maskReviewsCount,
    name,
    place_id: googlePlaceId,
  } = selected || {}

  const userIdMatch =
    user && maskReviews && maskReviews.length
      ? maskReviews.find(r => {
          return r.user && r.user._id === user._id
        })
      : null

  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(null)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const sliderRef = createRef()
  const reviewInput = useRef("")

  const handleSubmitButton = () => {
    setTimeout(() => {
      setSubmitButtonDisabled(true)
    }, 666)
  }

  const submitReview = useCallback(async () => {
    // try {
    setShowSubmitConfirmation(true)
    const geoCoordinates = {
      lat: location.lat(),
      lng: location.lng(),
    }
    const reviewData = {
      geoCoordinates,
      googlePlaceId,
      rating: sliderRef.current.props.value,
      review: reviewInput.current.value,
      user,
    }

    // fix zoom ratio and show message
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i)
    ) {
      var viewportmeta = document.querySelector('meta[name="viewport"]')
      if (viewportmeta) {
        viewportmeta.content =
          "width=device-width, minimum-scale=1.0, maximum-scale=1.0"
        document.body.addEventListener(
          "gesturestart",
          function () {
            viewportmeta.content =
              "width=device-width, minimum-scale=0.25, maximum-scale=1.6"
          },
          false
        )
      }
    }

    // save to db
    const savedReviewResponse = await postReview(reviewData).catch(c => c)
    if (
      !savedReviewResponse ||
      !savedReviewResponse.data ||
      savedReviewResponse.data.error ||
      (savedReviewResponse.data.status &&
        savedReviewResponse.data.status !== "200")
    ) {
      setSubmitError(
        // JSON.stringify(
        savedReviewResponse && savedReviewResponse.data
          ? savedReviewResponse.data.error
          : "Request has failed without a response. Please check your internet connection and try again."
        // )
      )
    } else {
      const { data: savedReview } = savedReviewResponse
      let updatedSelected = {
        ...selected,
        maskReviews: maskReviews.filter(r => r.user._id != user._id),
        maskRatingsCount: userIdMatch ? maskRatingsCount : maskRatingsCount - 1,
        maskReviewsCount: userIdMatch ? maskReviewsCount : maskReviewsCount - 1,
      }

      // insert this review at the top of the list
      updatedSelected.maskReviews.unshift(savedReview)

      // recalculate the rating
      updatedSelected = calculateMaskRating(updatedSelected)

      setSelected(updatedSelected)
      window.location.hash = `review_${savedReview._id}`
      close()
    }
  }, [selected])

  const SidebarContent = () => (
    <div
      className="post-review open-sidebar"
      style={{
        padding: 12,
      }}
    >
      <div style={styles.container}>
        <a onClick={close} className="top-button close">
          ✖️
        </a>
        <h1 style={{ display: "inline-block", marginTop: 0 }}>
          {userIdMatch ? "Edit Your" : "Post a"} Review
        </h1>
        <h2 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h2>
        <h3 style={styles.address}>{address}</h3>
        <div>
          <hr color="#eaeaea" />
          <form
            style={{ display: showSubmitConfirmation ? "none" : "block" }}
            onSubmit={e => {
              e.preventDefault()
              submitReview()
            }}
          >
            <h3>Rate the Wearing of Masks (0 - 5)</h3>
            <Slider
              ref={sliderRef}
              selected={selected}
              user={user}
              userIdMatch={userIdMatch}
            />
            <hr color="#eaeaea" />
            <h3>{userIdMatch ? "Edit Your" : "Write a"} Review (optional)</h3>
            <textarea
              ref={reviewInput}
              name="review"
              defaultValue={userIdMatch ? userIdMatch.review : ""}
              className={styles.textarea}
              placeholder="Write a short review of your experience at this location"
            />
            <p>
              <button
                className={`primary ${submitButtonDisabled && "disabled"}`}
                style={{ ...styles.button, marginRight: 12 }}
                type="submit"
                onClick={handleSubmitButton}
                disabled={submitButtonDisabled}
              >
                Post Rating &amp; Review
              </button>
              <button
                className="button"
                style={styles.button}
                type="cancel"
                onClick={close}
              >
                cancel
              </button>
            </p>
          </form>

          {(submitError && (
            <div style={{ fontSize: "1.2rem", color: "red" }}>
              {submitError}
            </div>
          )) || (
            <h1 style={{ display: showSubmitConfirmation ? "block" : "none" }}>
              Submitting Your Review...
            </h1>
          )}
        </div>
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
