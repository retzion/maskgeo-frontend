// libraries
import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"
import Cookies from "js-cookie"

// components
import ProfileButton from "./ProfileButton"
import ProfileSideBar from "./ProfileSideBar"
import Marker from "./Marker"
import InfoWindow from "./InfoWindow"
import Locate from "./Locate"
import PostReview from "./PostReview"
import Search from "./Search"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import PlaceTypesSidebar from "./PlaceTypesSidebar"
import FindPlacesButton from "./FindPlacesButton"

// helpers
import loadSelectedMarker from "./loadSelectedMarker"
import { decryptToken, processToken, removeToken } from "../../util/MaskGeoApi"

// design resources
import "@reach/combobox/styles.css"
import "./styles/index.css"
// import mapStyles from "./styles/mapStylesDark"
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
}

// Set default location to Salt Lake City, Utah
const startingPosition = { lat: 40.758701, lng: -111.876183 }

const libraries = ["places"]

let bounds, mapRef

const options = {
  center: startingPosition,
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  zoom: 12,
}

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
  const [showPlaceTypesButtons, setShowPlaceTypesButtons] = useState(null)

  function resetUrl() {
    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}`
      window.history.pushState({ path: newurl }, "", newurl)
    }
  }

  const checkToken = async () => {
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

      resetUrl()
    } else {
      // fetch user data via JWT and get rid of localstorage method
      const tokenResponse = await decryptToken()
      if (tokenResponse) setUser(tokenResponse.data)
    }
  }

  // check for https
  useEffect(() => {
    const protocol = document.location.protocol
    const host = document.location.host
    const pathname = document.location.pathname
    const env = process.env["NODE_ENV"]

    if (env === "production" && protocol !== "https:")
      document.location = `https://${host}${pathname}`
  }, [])

  // check for a login token
  useEffect(() => {
    checkToken()
  }, [])

  const setMarkerId = markerId => {
    if (markerId) {
      // load place details for a marker
      if (window.history.pushState) {
        const newurl = `${window.location.protocol}//${window.location.host}/marker/${markerId}`
        window.history.pushState({ path: newurl }, "", newurl)
      }
    }
  }

  const setSelectedId = selectedId => {
    if (selectedId) {
      // load place details for a marker
      if (window.history.pushState) {
        const newurl = `${window.location.protocol}//${window.location.host}/selected/${selectedId}`
        window.history.pushState({ path: newurl }, "", newurl)
      }
    }
  }

  const openSelected = useCallback(selectedObject => {
    setSelectedId(selectedObject.place_id)
    setDetails(selectedObject)
  }, [])

  mapRef = React.useRef()

  const panTo = React.useCallback(
    ({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng })
    },
    [mapRef]
  )

  async function createMarkersFromIds(markerIds, service) {
    let getDetailsPromises = new Array()
    for (let i = 0; i < markerIds.length; i++) {
      getDetailsPromises.push(
        new Promise((resolve, reject) => {
          service.getDetails({ placeId: markerIds[i] }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              bounds.extend(results.geometry.location)
              resolve(results)
            } else reject()
          })
        })
      )
    }
    const resolvedDetailsPromises = await Promise.all(
      getDetailsPromises.map(p => p.catch(() => undefined))
    )

    if (resolvedDetailsPromises) {
      setMarkers(resolvedDetailsPromises.filter(m => m))
      mapRef.current.fitBounds(bounds)
    }
  }

  const onMapLoad = React.useCallback(map => {
    mapRef.current = map

    map.addListener("center_changed", () => {
      const center = map.getCenter()
      const newCenter = { lat: center.lat(), lng: center.lng() }
      setPos(newCenter)
      bounds = map.getBounds()
    })

    const newPlacesService = new window.google.maps.places.PlacesService(map)
    setPlacesService(newPlacesService)

    bounds = new window.google.maps.LatLngBounds()

    /** Pan to Marker if param is found */
    let { marker: markerIds } = props.match.params
    if (markerIds) {
      markerIds = markerIds.split(",")

      if (markerIds.length > 1)
        createMarkersFromIds(markerIds, newPlacesService)
      else
        loadSelectedMarker({
          panTo,
          placeId: markerIds[0],
          places: window.google.maps.places,
          placesService: newPlacesService,
          pos,
          setMarkerId,
          setMarkers,
          setSelected,
        })
    }

    /** Open Selected Place Sidebar if param is found */
    const { selected: selectedPlace } = props.match.params
    if (selectedPlace) {
      // load place details for a marker
      loadSelectedMarker({
        openSelected,
        panTo,
        placeId: selectedPlace,
        places: window.google.maps.places,
        placesService: newPlacesService,
        pos,
        setMarkers,
        setSelected,
      })
    }
  }, [])

  if (loadError) return "Error"
  if (!isLoaded) return "Loading..."

  if (!Cookies.get("allow-access"))
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <input
          type="text"
          placeholder="Enter preview passcode"
          style={{ fontSize: "1.8rem", margin: "0 1%", width: "90%" }}
          onChange={e => {
            const value = e.target.value
            if (value === "1776") {
              Cookies.set("allow-access", true)
              document.location.reload()
            }
          }}
        />
      </div>
    )
  else
    return (
      <div className="map-container">
        <Locate panTo={panTo} setPos={setPos} />
        <ProfileButton user={user} setShowProfile={setShowProfile} />
        <FindPlacesButton setShowPlaceTypesButtons={setShowPlaceTypesButtons} />
        <div />

        <h1 className="logo">
          <span role="img" aria-label="tent">
            😷
          </span>{" "}
          Mask Forecast
        </h1>

        <Search
          panTo={panTo}
          setMarkerId={setMarkerId}
          setMarkers={setMarkers}
          setSelected={setSelected}
          showDetails={details}
          placesService={placesService}
          pos={pos}
          setPos={setPos}
          setShowPlaceTypesButtons={setShowPlaceTypesButtons}
        />

        {showPlaceTypesButtons && (
          <PlaceTypesSidebar
            bounds={bounds}
            close={() => {
              setShowPlaceTypesButtons(null)
            }}
            mapRef={mapRef}
            panTo={panTo}
            setMarkerId={setMarkerId}
            setMarkers={setMarkers}
            setSelected={setSelected}
            showDetails={details}
            placesService={placesService}
            pos={pos}
            setPos={setPos}
          />
        )}

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
                setSelected={async s => {
                  if (!s.reviews) {
                    await loadSelectedMarker({
                      panTo,
                      placeId: s.place_id,
                      places: window.google.maps.places,
                      placesService,
                      pos,
                      setSelected,
                    })
                  }
                  setSelected(s)
                  setMarkerId(s.place_id)
                }}
              />
            )
          })}

          {selected && (
            <InfoWindow
              place={selected}
              resetUrl={resetUrl}
              setSelected={setSelected}
              showDetails={() => {
                openSelected(selected)
              }}
            />
          )}

          {details && (
            <SelectedPlaceSideBar
              selected={selected}
              close={() => {
                setDetails(null)
                setMarkerId(selected.place_id)
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
