const React = require("react")
const { Marker: GoogleMarker } = require("@react-google-maps/api")

module.exports = props => {
  const { marker, setSelected } = props

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
