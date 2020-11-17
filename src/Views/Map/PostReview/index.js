import React, { useRef, useState } from "react"
import Sidebar from "react-sidebar"
import Slider from "./Slider"

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

export default ({ close, selected, user }) => {
  const {
    formatted_address: address,
    formatted_phone_number: phone,
    icon,
    name,
    rating = 0,
    user_ratings_total,
  } = selected || {}

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
          {/* <React.Fragment>
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
          </React.Fragment> */}
          <hr />
          <form
            style={{ display: "block" }}
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <h2>Rate the Wearing of Masks</h2>
            <Slider />
            <hr />
            <h2>Write a Review (optional)</h2>
            <textarea
              name="review"
              style={styles.textarea}
              placeholder="Write a short review of your experience at this location"
            />
            <p>
              <button className="primary" style={styles.button} onClick={null}>
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
