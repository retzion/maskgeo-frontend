import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

import "./index.css"

export default ({ panTo, setPos, setShowPlaceTypesButtons }) => {
  return (
    <button
      className="locate nav-button"
      title="Pan to your current location"
      onClick={() => {
        setShowPlaceTypesButtons(false)
        navigator.geolocation.getCurrentPosition(
          position => {
            const newPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setPos(newPos)
            panTo(newPos)
          },
          () => {
            alert("Unable to get your geolocation.")
          }
        )
      }}
    >
      <FontAwesomeIcon className="icon" icon={faMapMarkerAlt} />
    </button>
  )
}
