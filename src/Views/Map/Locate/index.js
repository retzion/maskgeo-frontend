import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"

import "./index.css"

export default ({
  mapRef,
  panTo,
  pos,
  setPos,
  setShowPlaceTypesButtons,
  setShowLoader,
}) => {
  const locate = () => {
    setShowPlaceTypesButtons(false)
    setShowLoader(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setShowLoader(false)
        setPos(newPos)
        panTo(newPos)
        mapRef.current.setZoom(12)
      },
      () => {
        setShowLoader(false)
        alert("Unable to get your geolocation.")
      }
    )
  }

  return (
    <button
      id="locate_button"
      className="locate nav-button"
      title="Pan to your current location"
      onClick={locate}
    >
      <FontAwesomeIcon className="icon" icon={faMapMarkerAlt} />
    </button>
  )
}
