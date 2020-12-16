// libraries
import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"
import UniversalCookie from "universal-cookie"

// components
import FindPlacesButton from "./FindPlacesButton"
import InfoWindow from "./InfoWindow"
import Locate from "./Locate"
import Marker from "./Marker"
import KeywordSearchPanel from "./KeywordSearchPanel"
import ProfileButton from "./ProfileButton"
import ProfileModal from "./ProfileModal"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import SplashPage from "./SplashPage"
import Loader from "../../Components/Loader"

// helpers
import loadSelectedMarker from "./loadSelectedMarker"
import storage from "../../util/LocalStorage"
import updateMeta from "../../util/updateMeta"
import urlHandlers from "../../util/urlHandlers"
import { decryptToken, processToken, removeToken } from "../../util/MaskGeoApi"
import { cookieNames, googleMapsApiKey, websiteSettings } from "../../config"
import { version } from "../../../package.json"

// images & styles
import logo from "../../assets/img/logo-w-text-horz.png"
import "@reach/combobox/styles.css"
import "./styles/index.css"
// import { config } from "@fortawesome/fontawesome-svg-core"
// import mapStyles from "./styles/mapStylesDark"
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
}

const Cookies = new UniversalCookie()

// Set default location to cookie value or Salt Lake City, Utah
const startingPosition = Cookies.get(cookieNames.position) || {
  lat: 40.758701,
  lng: -111.876183,
}

const libraries = ["places"]

let bounds, mapRef

const options = {
  center: startingPosition,
  // styles: mapStyles,
  disableDefaultUI: true,
  gestureHandling: "greedy",
  zoomControl: true,
  zoom: 12,
}

export default function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  })
  const [allowAccess, setAllowAccess] = useState(
    Cookies.get(cookieNames.allowCookies)
  )
  const [details, setDetails] = useState(null)
  const [keywordSearchOptions, setKeywordSearchOptions] = useState(null)
  const [searchBoxOptions, setSearchBoxOptions] = useState(null)
  const [markers, setMarkers] = useState([])
  const [placesService, setPlacesService] = useState(null)
  const [pos, setPosState] = useState(startingPosition)
  const [selected, setSelected] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showProfile, setShowProfile] = useState(null)
  const [showPlaceTypesButtons, setShowPlaceTypesButtons] = useState(null)
  const [user, setUser] = useState(null)

  function setPos(positionJson) {
    setPosState(positionJson)
    Cookies.set(cookieNames.position, positionJson)
  }

  function resetUrl() {
    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}`
      window.history.pushState({ path: newurl }, "", newurl)
    }
    setDetails(null)
    setSelected(null)
    setMarkers([])
  }

  // check for https
  useEffect(() => {
    const { protocol, host, pathname } = window.location
    const env = process.env["NODE_ENV"]

    if (env === "production" && protocol !== "https:")
      document.location = `https://${host}${pathname}`

    updateMeta()
  }, [])

  // check authentication
  useEffect(() => {
    ;(async () => {
      const { token } = props.match.params
      let response
      if (token) {
        // check for a token
        response = await ProcessToken(token)
        if (!response) {
          setUser(null)
          alert("Your magic login link has expired.")
        } else {
          setUser(response.user)
        }
        resetUrl()
      } else {
        response = await decryptToken()
        response = response ? response.data : null
        if (response && response.user) setUser(response.user)
      }
      if (response && response.accessToken)
        storage.setData("accessToken", response.accessToken)
    })()
  }, [])

  // geolocate upon loading
  React.useEffect(() => {
    setTimeout(() => {
      if (!Cookies.get(cookieNames.position)) {
        const btn = document.getElementById("locate_button")
        if (btn) btn.click()
      }
    }, 333)
  }, [])

  function setBounds(newBounds) {
    bounds = newBounds
  }

  const openSelected = useCallback(selectedObject => {
    if (selectedObject) urlHandlers.setSelectedId(selectedObject.place_id, true)
    setSelected(selectedObject)
    setDetails(selectedObject)
    updateMeta(selectedObject)
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
            } else {
              reject()
            }
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

  async function evalParams(newPlacesService) {
    let { marker: markerIds } = props.match.params
    const {
      keyword,
      locationZoom,
      search: searchInput,
      selected: selectedPlace,
    } = props.match.params
    const {
      location: { search },
    } = props
    const _showDetails = search.includes("details")
    setShowDetails(_showDetails)

    /** Pan to Marker if param is found */
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
          setMarkerId: urlHandlers.setMarkerId,
          setMarkers,
          setSelected,
          showPlaceDetails: _showDetails,
        })
    }

    /** Open Selected Place Sidebar if param is found */
    if (!keyword && !searchInput && selectedPlace) {
      // load place details for a marker
      loadSelectedMarker({
        openSelected,
        showPlaceDetails: _showDetails,
        panTo,
        placeId: selectedPlace,
        places: window.google.maps.places,
        placesService: newPlacesService,
        pos,
        setMarkers,
        setSelected,
        setShowLoader,
      })
    }

    /** Open SearchBox results if param is found */
    if (searchInput && locationZoom) {
      let [lat, lng, zoom = 12] = locationZoom.split(",")
      lat = lat.replace("@", "")

      setSearchBoxOptions({
        searchInput: decodeURIComponent(searchInput),
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        selectedId: selectedPlace,
        showPlaceDetails: _showDetails,
        zoom,
      })

      setShowPlaceTypesButtons(true)
      if (_showDetails) setDetails(selectedPlace)
    }

    /** Open Keyword search results if param is found */
    if (keyword && locationZoom) {
      let [lat, lng, zoom = 12] = locationZoom.split(",")
      lat = lat.replace("@", "")
      setKeywordSearchOptions({
        keyword: decodeURIComponent(keyword),
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        selectedId: selectedPlace,
        showPlaceDetails: _showDetails,
        zoom,
      })
      setShowPlaceTypesButtons(true)
    }

    /** Open profile sidebar if query param is found */
    if (search.match("profile")) setShowProfile(true)
  }

  const onMapLoad = React.useCallback(map => {
    mapRef.current = map

    bounds = map.getBounds()

    map.addListener("click", e => {
      if ("placeId" in e) {
        // This is most likely a Google Place of Interest marker click
        // We will stop the Google infowindow from showing and load our custom infowindow
        e.stop()
        setSelected(e)
        loadSelectedMarker({
          panTo,
          placeId: e.placeId,
          places: window.google.maps.places,
          placesService: newPlacesService,
          pos,
          setMarkerId: urlHandlers.setMarkerId,
          setMarkers,
          setSelected,
        })
      } else {
        setSelected(null)
        urlHandlers.setMarkerId()
      }
    })

    map.addListener("center_changed", () => {
      const center = map.getCenter()
      const newCenter = { lat: center.lat(), lng: center.lng() }
      setPos(newCenter)
      bounds = map.getBounds()
    })

    const newPlacesService = new window.google.maps.places.PlacesService(map)
    setPlacesService(newPlacesService)

    evalParams(newPlacesService)
  }, [])

  async function logOut() {
    await removeToken()
    Cookies.remove(cookieNames.jwtAccessToken, { httpOnly: true, path: "/" })
    Cookies.remove(cookieNames.jwtRefreshToken, { httpOnly: true, path: "/" })
    Cookies.remove(cookieNames.allowCookies, { path: "/" })
    Cookies.remove(cookieNames.position, { path: "/" })
    storage.clearStorage()
    setUser(null)
  }

  if (loadError) return "Error"
  if (!isLoaded) return <Loader />

  return (
    <div className="map-container">
      <Loader show={showLoader} />
      {!allowAccess && <SplashPage setAllowAccess={setAllowAccess} />}

      <Locate
        mapRef={mapRef}
        panTo={panTo}
        pos={pos}
        setPos={setPos}
        setShowLoader={setShowLoader}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      />

      <ProfileButton
        user={user}
        setShowProfile={setShowProfile}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
        setProfileQueryParam={urlHandlers.setProfileQueryParam}
      />

      <FindPlacesButton
        setKeywordSearchOptions={setKeywordSearchOptions}
        setSearchBoxOptions={setSearchBoxOptions}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      />

      <img
        src={logo}
        alt={websiteSettings.friendlyName}
        title="click to reset map"
        className="logo"
        onClick={resetUrl}
        style={{ cursor: "pointer" }}
      />

      {showPlaceTypesButtons && (
        <KeywordSearchPanel
          getBounds={() => bounds}
          close={() => {
            setShowPlaceTypesButtons(null)
          }}
          keywordSearchOptions={keywordSearchOptions}
          searchBoxOptions={searchBoxOptions}
          mapRef={mapRef}
          panTo={panTo}
          placesService={placesService}
          pos={pos}
          setBounds={setBounds}
          setDetails={setDetails}
          setKeywordSearchUrl={urlHandlers.setKeywordSearchUrl}
          setMarkers={setMarkers}
          setPlacesSearchBoxUrl={urlHandlers.setPlacesSearchBoxUrl}
          setSelected={setSelected}
          setShowLoader={setShowLoader}
          showProfile={showProfile}
        />
      )}

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onMapLoad}
      >
        {markers.map(marker => {
          marker.customIcon = true
          return (
            <Marker
              key={marker["place_id"]}
              marker={marker}
              setSelected={async s => {
                setSelected(s)
                if (!s.reviews) {
                  const place = await loadSelectedMarker({
                    panTo,
                    placeId: s.reference || s.place_id,
                    places: window.google.maps.places,
                    placesService,
                    pos,
                    setSelected,
                  })
                  setSelected(place)
                }
                urlHandlers.setMarkerId(s.place_id, showDetails)
              }}
            />
          )
        })}

        {selected && (
          <InfoWindow
            place={selected}
            close={() => {
              setSelected(null)
              urlHandlers.setMarkerId()
            }}
            showDetails={() => {
              openSelected(selected)
            }}
          />
        )}
      </GoogleMap>

      {details && (
        <SelectedPlaceSideBar
          selected={selected}
          close={() => {
            setDetails(null)
            if (selected) urlHandlers.setMarkerId(selected.place_id)
            updateMeta()
          }}
          user={user}
          openProfile={() => {
            setShowProfile(true)
          }}
          setSelected={setSelected}
        />
      )}

      {showProfile && (
        <ProfileModal
          user={user}
          logOut={logOut}
          close={() => {
            setShowProfile(null)
            urlHandlers.setProfileQueryParam(null)
          }}
        />
      )}

      <span className="version">
        app:v{version} | api:v{storage.getData("apiVersion")}
      </span>
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
