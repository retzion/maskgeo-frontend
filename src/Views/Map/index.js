// libraries
import React from "react"
import { useEffect, useState } from "react"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"

// components
import ProfileButton from "./ProfileButton"
import ProfileSideBar from "./ProfileSideBar"
import Marker from "./Marker"
import InfoWindow from "./InfoWindow"
import Locate from "./Locate"
import PostReview from "./PostReview"
import Search from "./Search"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import { decryptToken, processToken, removeToken } from "../../util/MaskGeoApi"

// design resources
import "@reach/combobox/styles.css"
import "./index.css"
// import mapStyles from "./mapStyles"

// Set default location to Salt Lake City, Utah
const startingPosition = { lat: 40.758701, lng: -111.876183 }

const libraries = ["places"]
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
}
const options = {
  center: startingPosition,
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  zoom: 12,
}
let mapRef

export default function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)
  const [pos, setPos] = useState(startingPosition)
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(null)
  const [showPostReview, setShowPostReview] = useState(null)
  const [placesService, setPlacesService] = useState(null)

  useEffect(() => {
    // check for user data
    ;(async () => {
      const { token } = props.match.params
      if (token) {
        // check for a token
        const validToken = await ProcessToken(token)
        if (!validToken) {
          setUser(null)
          alert("Your magic login link has expired.")
        } else {
          setUser(validToken)
        }

        if (window.history.pushState) {
          const newurl = `${window.location.protocol}//${window.location.host}`
          window.history.pushState({ path: newurl }, "", newurl)
        }
      } else {
        // fetch user data via JWT and get rid of localstorage method
        const tokenResponse = await decryptToken()
        if (tokenResponse) setUser(tokenResponse.data)
      }
    })()
  }, [])

  mapRef = React.useRef()
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map

    map.addListener("center_changed", () => {
      const center = map.getCenter()
      const newCenter = {lat: center.lat(), lng: center.lng()}
      setPos(newCenter)
    })

    // const bounds = new window.google.maps.LatLngBounds()
    // const request = {
    //   bounds: bounds,
    //   type: ["restaurant"],
    // }
    const newPlacesService = new window.google.maps.places.PlacesService(map)
    setPlacesService(newPlacesService)
    // newPlacesService.nearbySearch(request, (results, status) => {
    //   if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //     console.log(results)
    //   }
    // })
  }, [])

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
  }, [])

  if (loadError) return "Error"
  if (!isLoaded) return "Loading..."

  return (
    <div className="map-container">
      <Locate panTo={panTo} setPos={setPos} />
      <ProfileButton user={user} setShowProfile={setShowProfile} />

      <h1 className="logo">
        Mask Forecast{" "}
        <span role="img" aria-label="tent">
          😷
        </span>
      </h1>

      <Search
        panTo={panTo}
        setMarkers={setMarkers}
        setSelected={setSelected}
        placesService={placesService}
        pos={pos}
        setPos={setPos}
      />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onMapLoad}
      >
        {markers.map(marker => {
          return (
            <Marker
              key={marker["place_id"]}
              marker={marker}
              setSelected={setSelected}
            />
          )
        })}

        {selected && (
          <InfoWindow
            place={selected}
            setSelected={setSelected}
            showDetails={() => {
              setDetails(selected)
            }}
          />
        )}

        {details && (
          <SelectedPlaceSideBar
            selected={selected}
            close={() => {
              setDetails(null)
            }}
            user={user}
            openProfile={() => {
              setShowProfile(true)
            }}
            setShowPostReview={setShowPostReview}
          />
        )}

        {showProfile && (
          <ProfileSideBar
            user={user}
            logOut={() => {
              removeToken()
              setUser(null)
            }}
            close={() => {
              setShowProfile(null)
            }}
          />
        )}

        {showPostReview && (
          <PostReview
            user={user}
            selected={selected}
            close={() => {
              setShowPostReview(null)
            }}
            setSelected={setSelected}
          />
        )}
      </GoogleMap>
    </div>
  )
}

async function ProcessToken(token) {
  /** Send token to backend to retrieve JWT */
  const response = await processToken(token)
  const valid = response && response.status === 200 && response.data

  if (!valid) return
  else return response.data
}
