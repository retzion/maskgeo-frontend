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
import Search from "./Search"
import SelectedPlaceSideBar from "./SelectedPlaceSideBar"
import SplashPage from "./SplashPage"
import Loader from "../../Components/Loader"

// helpers
import loadSelectedMarker from "./loadSelectedMarker"
import storage from "../../util/LocalStorage"
import { decryptToken, processToken, removeToken } from "../../util/MaskGeoApi"
import { cookieNames } from "../../config"
import { version } from "../../../package.json"

// design resources
import "@reach/combobox/styles.css"
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
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const [allowAccess, setAllowAccess] = useState(
    Cookies.get(cookieNames.allowCookies)
  )
  const [details, setDetails] = useState(null)
  const [keywordSearchOptions, setKeywordSearchOptions] = useState(null)
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

  // URL handlers
  const urlHandler = {
    setMarkerId: markerId => {
      if (window.history.pushState) {
        const indexOfSelected = window.location.href.indexOf("/selected/")
        let newurl =
          indexOfSelected > 0
            ? window.location.href.substring(0, indexOfSelected)
            : window.location.href
        if (markerId) newurl += `/selected/${markerId}`
        window.history.pushState(
          { path: newurl },
          "",
          newurl + window.location.hash
        )
      }
    },
    setKeywordSearchUrl: params => {
      const { keyword, location, selected, zoom = 12 } = params
      if (keyword && location) {
        // load markerss for a nearby search
        if (window.history.pushState) {
          let newurl = `${window.location.protocol}//${window.location.host}/search/${keyword}/@${location.lat},${location.lng},${zoom}`
          if (selected) newurl += `/selected/${selected}`
          window.history.pushState({ path: newurl }, "", newurl)
        }
      }
    },
    setSelectedId: (selectedId, details) => {
      // load place details for a marker
      if (window.history.pushState) {
        const trimmedPathname = !selectedId
          ? window.location.pathname
          : window.location.pathname.replace(`/selected/${selectedId}`, "")
        let newurl = `${window.location.protocol}//${window.location.host}${trimmedPathname}`
        if (selectedId) newurl += `/selected/${selectedId}`
        if (details) newurl += `?details=1`
        window.history.pushState(
          { path: newurl },
          "",
          newurl + window.location.hash
        )
      }
    },
    setProfileQueryParam: show => {
      // set URL
      if (window.history.pushState) {
        const href = window.location.href.replace("?profile", "")
        const newurl = show ? `${href}?profile` : href
        window.history.pushState({ path: newurl }, "", newurl)
      }
    },
  }

  const openSelected = useCallback(selectedObject => {
    if (selectedObject) urlHandler.setSelectedId(selectedObject.place_id, true)
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
    const { keyword, selected: selectedPlace } = props.match.params
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
          setMarkerId: urlHandler.setMarkerId,
          setMarkers,
          setSelected,
        })
    }

    /** Open Selected Place Sidebar if param is found */
    if (!keyword && selectedPlace) {
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

    /** Open Keyword search results if param is found */
    if (keyword && locationZoom) {
      let [lat, lng, zoom = 12] = locationZoom.split(",")
      lat = lat.replace("@", "")
      setKeywordSearchOptions({
        keyword,
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

    map.addListener("center_changed", () => {
      const center = map.getCenter()
      const newCenter = { lat: center.lat(), lng: center.lng() }
      setPos(newCenter)
      bounds = map.getBounds()
    })

    const newPlacesService = new window.google.maps.places.PlacesService(map)
    setPlacesService(newPlacesService)

    bounds = new window.google.maps.LatLngBounds()

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
        panTo={panTo}
        setPos={setPos}
        setShowLoader={setShowLoader}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      />

      <ProfileButton
        user={user}
        setShowProfile={setShowProfile}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
        setProfileQueryParam={urlHandler.setProfileQueryParam}
      />

      <FindPlacesButton
        setKeywordSearchOptions={setKeywordSearchOptions}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      />

      <div />

      <h1 className="logo">
        <span role="img" aria-label="tent">
          😷
        </span>{" "}
        Mask Forecast
      </h1>

      {/* <Search
        panTo={panTo}
        setMarkerId={urlHandler.setMarkerId}
        setMarkers={setMarkers}
        setSelected={setSelected}
        showDetails={details}
        placesService={placesService}
        pos={pos}
        setPos={setPos}
        setShowPlaceTypesButtons={setShowPlaceTypesButtons}
      /> */}

      {showPlaceTypesButtons && (
        <KeywordSearchPanel
          bounds={bounds}
          close={() => {
            setShowPlaceTypesButtons(null)
          }}
          keywordSearchOptions={keywordSearchOptions}
          mapRef={mapRef}
          panTo={panTo}
          placesService={placesService}
          pos={pos}
          showProfile={showProfile}
          setShowLoader={setShowLoader}
          setKeywordSearchUrl={urlHandler.setKeywordSearchUrl}
          setMarkers={setMarkers}
          setSelected={setSelected}
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
                urlHandler.setMarkerId(s.place_id)
              }}
            />
          )
        })}

        {selected && (
          <InfoWindow
            place={selected}
            close={() => {
              setSelected(null)
              urlHandler.setMarkerId()
            }}
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
              urlHandler.setMarkerId(selected.place_id)
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
              urlHandler.setProfileQueryParam(null)
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
