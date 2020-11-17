import React from "react"
import { Marker as GoogleMarker } from "@react-google-maps/api"

export default ({ marker, setSelected }) => {

  if (!marker.geometry) return null
  else
    return (
      <GoogleMarker
        position={{
          lat: marker.geometry.location.lat(),
          lng: marker.geometry.location.lng(),
        }}
        onClick={() => {
          setSelected(marker)
        }}
        icon={{
          url: `/mask.svg`,
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      />
    )
}
