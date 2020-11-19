import React from "react"
import { InfoWindow as GoogleInfoWindow } from "@react-google-maps/api"
import MaskRatingIcons from "../../../Components/MaskRatingIcons"

// styles
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })
const styles = {
  container: {
    fontSize: "1rem",
    textAlign: "center",
    // width: "300px",
  },
  title: {
    fontSize: "1.2rem",
  },
  icon: { height: 18, marginRight: 6 },
  address: {
    fontSize: "0.81rem",
    fontWeight: 450,
  },
  ratingText: {
    fontStyle: "italic",
    fontSize: "0.81rem",
  },
  detailsContainer: { margin: 3, padding: 3, },
  details: { cursor: "pointer", color: "-webkit-link" },
}

export default ({
  place,
  place: {
    formatted_address: address,
    geometry,
    icon,
    maskRating,
    maskRatingsCount,
    name,
  },
  resetUrl,
  setSelected,
  showDetails,
}) => {
  if (!place) return null

  return (
    <GoogleInfoWindow
      position={{
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
      }}
      onCloseClick={() => {
        setSelected(null)
        resetUrl()
      }}
    >
      <div style={styles.container}  onClick={showDetails}>
        <h1 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>
        <h2 style={styles.address}>{address}</h2>

        {maskRatingsCount ? (
          <React.Fragment>
            <MaskRatingIcons
              maskRating={maskRating}
              maskRatingsCount={maskRatingsCount}
              styles={ratingStyles}
              widthMultiplier={21}
            />
            <br />
            <span style={styles.ratingText}>
              {maskRating.toFixed(2)} / 5 masks
            </span>
          </React.Fragment>
        ) : (
          "not yet rated"
        )}
        <p style={styles.detailsContainer}>
          <a style={styles.details}>
            view details
          </a>
        </p>
      </div>
    </GoogleInfoWindow>
  )
}
