import React from "react"

import "./index.css"

export default ({ panTo, setPos }) => {
  return (
    <button
      className="locate"
      title="Pan to your current location"
      onClick={() => {
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
      🧭
    </button>
  )
}
