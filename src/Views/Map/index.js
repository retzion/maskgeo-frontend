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
import PostReview from "./PostReview"
import ProfileButton from "./ProfileButton"
import ProfileSideBar from "./ProfileSideBar"
// import Search from "./Search"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import SplashPage from "./SplashPage"
import Loader from "../../Components/Loader"

// helpers
import loadSelectedMarker from "./loadSelectedMarker"
import storage from "../../util/LocalStorage"
import urlHandlers from "../../util/urlHandlers"
import { decryptToken, processToken, removeToken } from "../../util/MaskGeoApi"
import { cookieNames, googleMapsApiKey } from "../../config"
import { version } from "../../../package.json"

// design resources
import "@reach/combobox/styles.css"
import logo from "../../assets/img/logo.png"
import "./styles/index.css"
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
  const [showLoader, setShowLoader] = useState(false)
  const [showProfile, setShowProfile] = useState(null)
  const [showPostReview, setShowPostReview] = useState(null)
  const [showPlaceDetails, setShowPlaceDetails] = useState(null)
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
  }

  // check for https
  useEffect(() => {
    const { protocol, host, pathname } = window.location
    const env = process.env["NODE_ENV"]

    if (env === "production" && protocol !== "https:")
      document.location = `https://${host}${pathname}`
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

  function setBounds(newBounds) {
    bounds = newBounds
  }

  const openSelected = useCallback(selectedObject => {
    if (selectedObject) urlHandlers.setSelectedId(selectedObject.place_id, true)
    setSelected(selectedObject)
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

  function evalParams(newPlacesService) {
    let { marker: markerIds } = props.match.params
    const { keyword, search: searchInput, selected: selectedPlace } = props.match.params
    const { locationZoom, selected } = props.match.params
    const {
      location: { search },
    } = props
    const profile = search.includes("profile")

    const showPlaceDetails = search.includes("details")
    setShowPlaceDetails(showPlaceDetails)

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
        })
    }

    /** Open Selected Place Sidebar if param is found */
    if (!keyword && !searchInput && selectedPlace) {
      // load place details for a marker
      loadSelectedMarker({
        openSelected,
        showPlaceDetails,
        panTo,
        placeId: selectedPlace,
        places: window.google.maps.places,
        placesService: newPlacesService,
        pos,
        setMarkers,
        setSelected,
      })
    }

    /** Open SearchBox results if param is found */
    if (searchInput && locationZoom) {
      let [lat, lng, zoom = 12] = locationZoom.split(",")
      lat = lat.replace("@", "")
      console.log({zoom})

      setSearchBoxOptions({
        searchInput: decodeURIComponent(searchInput),
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        selected,
        zoom,
      })
      
      setShowPlaceTypesButtons(true)
      if (showPlaceDetails) setDetails(selected)
    }

    /** Open Keyword search results if param is found */
    if (keyword && locationZoom) {
      let [lat, lng, zoom = 12] = locationZoom.split(",")
      lat = lat.replace("@", "")
      setKeywordSearchOptions({
        keyword: decodeURIComponent(keyword),
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        selected,
        zoom,
      })
      setShowPlaceTypesButtons(true)
      if (showPlaceDetails) setDetails(selected)
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
      }
    })

    map.addListener("center_changed", () => {
      const center = map.getCenter()
      const newCenter = { lat: center.lat(), lng: center.lng() }
      setPos(newCenter)
      bounds = map.getBounds()
      console.log("center changed")
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
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      />

      <div />

      <h1 className="logo">
        <span role="img" aria-label="tent">
          <img src={logo} alt="mask" />
        </span>{" "}
        Mask Forecast
      </h1>

      {/* <div className="search-container">
        <input
          id="search"
          type="text"
          placeholder="Search..."
          className="search"
        />
      </div> */}

      {showPlaceTypesButtons && (
        <KeywordSearchPanel
          getBounds={() => (bounds)}
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
          setShowLoader={setShowLoader}
          setKeywordSearchUrl={urlHandlers.setKeywordSearchUrl}
          setMarkers={setMarkers}
          setPlacesSearchBoxUrl={urlHandlers.setPlacesSearchBoxUrl}
          setSelected={setSelected}
          setPos={setPos}
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
                urlHandlers.setMarkerId(s.place_id)
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
          logOut={logOut}
          close={() => {
            setShowProfile(null)
            urlHandlers.setProfileQueryParam(null)
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
