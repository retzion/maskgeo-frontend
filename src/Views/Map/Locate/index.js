import React from "react"

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
          () => null
        )
      }}
    >
      🧭
    </button>
  )
}
