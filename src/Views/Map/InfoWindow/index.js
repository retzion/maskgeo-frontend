import React from "react"
import { InfoWindow as GoogleInfoWindow } from "@react-google-maps/api"
import MaskRatingIcons from "../../../Components/MaskRatingIcons"

// styles
import smallRatingIconCount from "../../../Components/MaskRatingIcons/styles/smallRatingIconCount"
const ratingStyles = smallRatingIconCount({ height: 30, width: 150 })

export default ({
  place,
  place: {
    formatted_address: address,
    formatted_phone_number: phone,
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

  const styles = {
    container: {
      fontSize: "1rem",
      textAlign: "center",
      minWidth: "240px",
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
      textDecoration: "none",
    },
    ratingText: {
      fontStyle: "italic",
    },
    details: { cursor: "pointer", color: "-webkit-link" },
  }

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
      <div style={styles.container}>
        <h1 style={styles.title}>
          {icon && <img src={icon} alt="" style={styles.icon} />}
          {name}
        </h1>
        <h2 style={styles.address}>{address}</h2>
        <p>
          <a href={`tel:${phone}`} style={styles.phone}>
            {phone}
          </a>
        </p>

        {maskRatingsCount ? (
          <React.Fragment>
            <MaskRatingIcons
              maskRating={maskRating}
              maskRatingsCount={maskRatingsCount}
              styles={ratingStyles}
              widthMultiplier={30}
            />
            <br />
            <span style={styles.ratingText}>
              {maskRating.toFixed(2)} / 5 masks
            </span>
          </React.Fragment>
        ) : (
          "not yet rated"
        )}
        <p>
          <a onClick={showDetails} style={styles.details}>
            view details
          </a>
        </p>
      </div>
    </GoogleInfoWindow>
  )
}
