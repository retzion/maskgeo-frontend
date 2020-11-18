import React, { useCallback, useRef, useState } from "react"
import Sidebar from "react-sidebar"

// components
import Slider from "./Slider"

// helper
import { postReview } from "../../../util/MaskGeoApi"

//styles
const styles = {
  sidebar: {
    sidebar: {
      background: "white",
      width: "99%",
      maxWidth: 550,
    },
  },
  close: {
    float: "right",
    cursor: "pointer",
    margin: "0 0 12px 12px",
    fontSize: "2rem",
    textShadow: "2px 2px #ccc",
  },
  container: {
    fontSize: "1rem",
    textAlign: "left",
    minWidth: "240px",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: 0,
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
    name,
    place_id: googlePlaceId,
  } = selected || {}

  const sliderRef = React.createRef()
  const reviewInput = useRef("")

  const submitReview = React.useCallback(async () => {
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

    // save to db
    const savedReviewResponse = await postReview(reviewData)
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
  }, [selected])

  const SidebarContent = () => (
    <div
      style={{
        padding: 12,
      }}
    >
      <a onClick={close} style={styles.close}>
        ✖️
      </a>
      <div style={styles.container}>
        <h1>Post a Review</h1>
        <h2 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h2>
        <h3 style={styles.address}>{address}</h3>
        <div>
          <hr />
          <form
            style={{ display: "block" }}
            onSubmit={e => {
              e.preventDefault()
              submitReview()
            }}
          >
            <h2>Rate the Wearing of Masks</h2>
            <Slider ref={sliderRef} />
            <hr />
            <h2>Write a Review (optional)</h2>
            <textarea
              ref={reviewInput}
              name="review"
              style={styles.textarea}
              placeholder="Write a short review of your experience at this location"
            />
            <p>
              <button className="primary" style={styles.button} type="submit">
                Post Rating &amp; Review
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <Sidebar
      sidebar={<SidebarContent />}
      open={true}
      children={[]}
      pullRight={true}
      styles={styles.sidebar}
    />
  )
}
