import React from "react"
import { InfoWindow as GoogleInfoWindow } from "@react-google-maps/api"
import MaskRatingIcons from "../../../Components/MaskRatingIcons"

// styles
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
import "./index.css"
const ratingStyles = smallRatingIconCount({ height: 21, width: 105 })
const styles = {
  icon: { height: 18, marginRight: 6 },
  detailsContainer: { margin: 3, padding: 3 },
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
      <div className="info-window-container" onClick={showDetails}>
        <h1 className="title">
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>
        <h2 className="address">{address}</h2>

        {maskRatingsCount ? (
          <React.Fragment>
            <MaskRatingIcons
              maskRating={maskRating}
              maskRatingsCount={maskRatingsCount}
              styles={ratingStyles}
              widthMultiplier={21}
            />
            <br />
            <span className="rating-text">
              {maskRating.toFixed(2)} / 5 masks
            </span>
          </React.Fragment>
        ) : address ? (
          <span className="rating-text">not yet rated</span>
        ) : (
          <span className="rating-text">loading...</span>
        )}
        <p style={styles.detailsContainer}>
          {address && <a style={styles.details}>view details</a>}
        </p>
      </div>
    </GoogleInfoWindow>
  )
}
