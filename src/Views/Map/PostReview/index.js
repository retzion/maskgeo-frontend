import React, { createRef, useCallback, useRef, useState } from "react"
import Sidebar from "react-sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

// components
import Slider from "./Slider"

// helper
import { postReview } from "../../../util/MaskGeoApi"

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
    fontSize: "1.5rem",
    margin: 0,
  },
  icon: { height: 24, marginRight: 9 },
  address: {
    marginTop: 12,
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  textarea: { padding: 9, width: "90%", height: 90, marginBottom: 6 },
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
    name,
    place_id: googlePlaceId,
  } = selected || {}

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
      user: {
        _id: user._id,
        username: user.username,
      },
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
    console.log(savedReviewResponse)
    if (
      !savedReviewResponse ||
      !savedReviewResponse.data ||
      savedReviewResponse.data.error ||
      (savedReviewResponse.data.status &&
        savedReviewResponse.data.status !== "200")
    ) {
      setSubmitError(
        JSON.stringify(
          savedReviewResponse && savedReviewResponse.data
            ? savedReviewResponse.data
            : {
                error: "Request to POST /review has failed without a response",
                status: 400,
              }
        )
      )
    } else {
      const { data: savedReview } = savedReviewResponse
      if (savedReview.error) alert(savedReview.error)
      else {
        let updatedSelected = { ...selected }
        updatedSelected.maskReviews.unshift(savedReview)
        updatedSelected.maskRatingsCount++
        const averageRating =
          (selected.maskRatingsCount * selected.maskRating) /
            selected.maskRatingsCount || 0
        updatedSelected.maskRating =
          (averageRating * selected.maskRatingsCount + savedReview.rating) /
          updatedSelected.maskRatingsCount
        setSelected(updatedSelected)
        close()
      }
    }
    // } catch (c) {
    //   alert(c)
    // }
  }, [selected])

  const SidebarContent = () => (
    <div
      className="post-review"
      style={{
        padding: 12,
      }}
    >
      <div style={styles.container}>
        <a onClick={close} className="top-button close">
          ✖️
        </a>
        <h1 style={{ display: "inline-block", marginTop: 0 }}>Post a Review</h1>
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
            <h2>Rate the Wearing of Masks (0 - 5)</h2>
            <Slider ref={sliderRef} selected={selected} />
            <hr color="#eaeaea" />
            <h2>Write a Review (optional)</h2>
            <textarea
              ref={reviewInput}
              name="review"
              style={styles.textarea}
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

          {submitError || (
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
